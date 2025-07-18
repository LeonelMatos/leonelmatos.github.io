#!/usr/bin/env python3

#Post Upload Tool Automated
import os
import re
import json
import subprocess
import frontmatter # type: ignore
import markdown
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
import hashlib
from urllib.parse import urlparse
from dotenv import load_dotenv # type: ignore
import sys

load_dotenv()

env_vars = [
    'BLOG_POSTS_DIR',
    'LOCAL_WEBP_DIR',
    'OUTPUT_FILE',
    'R2_BUCKET',
    'R2_PREFIX',
    'R2_ACCOUNT_ID',
    'CACHE_FILE'
]

missing_vars = [var for var in env_vars if not os.getenv(var)]
if missing_vars:
    print(f"Error: Missing required variables: {', '.join(missing_vars)}")
    sys.exit(1)

#Config
BLOG_POSTS_DIR = Path(os.getenv('BLOG_POSTS_DIR'))
LOCAL_WEBP_DIR = Path(os.getenv('LOCAL_WEBP_DIR'))
OUTPUT_FILE = Path(os.getenv('OUTPUT_FILE'))
R2_BUCKET = os.getenv('R2_BUCKET')
R2_PREFIX = os.getenv('R2_PREFIX')
R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
RCLONE_REMOTE = os.getenv('RCLONE_REMOTE', 'r2:')
CACHE_FILE = Path(os.getenv('CACHE_FILE'))

R2_BASE_URL = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{R2_BUCKET}/{R2_PREFIX}'


#Check dirs
LOCAL_WEBP_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

MD_IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")

#Track to avoid duplicates at runtime or cached
processed_images = {}
uploaded_images_cache = {}

#Load image upload cache
def load_cache():
    global uploaded_images_cache
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r') as f:
                uploaded_images_cache = json.load(f)
                print(f"Loaded image cache ({len(uploaded_images_cache)} entries)")
        except json.JSONDecodeError:
            print("Cache file nonexistant, starting fresh")
            uploaded_images_cache = {}

#Save images uploaded to cache file
def save_cache():
    with open(CACHE_FILE, 'w') as f:
        json.dump(uploaded_images_cache, f, indent=2)
    print(f"Saved images to cache ({len(uploaded_images_cache)} entries)")

#Check if path is url
def is_url(path: str) -> bool:
    try:
        result = urlparse(path)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

#Convert image to webp
def convert_to_webp(src_path: Path) -> Path:
    dest = LOCAL_WEBP_DIR / (src_path.stem + '.webp')
    #Only convert if destination doesn't exist or source is newer than destination
    if not dest.exists() or (src_path.stat().st_mtime > dest.stat().st_mtime):
        try:
            subprocess.run([
                'ffmpeg', '-y', '-v', 'error' '-i', str(src_path),
                '-c:v', 'libwebp',
                '-q:v', '90',
                '-preset', 'photo',
                '-compression_level', '6',
                '-lossless', '0',
                str(dest)
            ], check=True, stderr=subprocess.PIPE)
            print(f"Converted {src_path} to webp")
        except subprocess.CalledProcessError as e:
            print(f"Error: Error converting {src_path} to webp")
            print(f"Error: {e.stderr.decode()}")
            raise
    return dest

#Upload local images to r2
def upload_to_r2(local_path: Path, key: str):
    remote = f"{RCLONE_REMOTE}{R2_BUCKET}/{R2_PREFIX}{key}"

    #Only upload if not already processed
    if key not in processed_images:
        subprocess.run([
            'rclone', 'copyto', str(local_path), remote
        ], check=True)
        processed_images[key] = R2_BASE_URL + key
        print(f"Uploaded {local_path} to R2 as key:{key}")
    return processed_images[key]

#Process image path, converting to webp and uploading to R2
def process_image(image_path: str, post_dir: Path) -> str:
    if is_url(image_path):
        return image_path
    
    local_path = (post_dir / image_path).resolve()

    if not local_path.exists():
        print(f"Error: Image not found: {local_path}")
        return image_path

    #Generate key on content hash
    with open(webp_path, 'rb') as f:
        file_hash = hashlib.md5(f.read()).hexdigest()
    key = f"{file_hash}.webp"

    if key in uploaded_images_cache:
        print(f"Using cached image: {key}. File {local_path} not used")
        return uploaded_images_cache[key]

    webp_path = convert_to_webp(local_path)

    url = upload_to_r2(webp_path, key)
    uploaded_images_cache[key] = url
    return url

#Process markdown content to html
def process_post_content(content: str, post_dir: Path) -> str:
    html_content = markdown.markdown(content)
    soup = BeautifulSoup(html_content, 'html.parser')

    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src:
            new_src = process_image(src, post_dir)
            img['src'] = new_src
    return str(soup)

#Parses html, replaces <img> src from local path to r2 URLs
def replace_img_src(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    for img in soup.find_all('img'):
        src = img.get('src', '')
        local_path = (BLOG_POSTS_DIR / src).resolve()
        if local_path.exists():
            webp_local = convert_to_webp(local_path)
            key = webp_local.name
            url = upload_to_r2(webp_local, key)
            img['src'] = url
    return str(soup)

#Process all posts, generates JSON
def process_posts():
    posts = []
    valid_files = [f for f in os.listdir(BLOG_POSTS_DIR) if f.endswith('.md')]

    print(f"Found {len(valid_files)} markdown files in {BLOG_POSTS_DIR}")

    load_cache()

    for filename in valid_files:
        filepath = BLOG_POSTS_DIR / filename
        with open(filepath, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)

            #Skip hidden posts
            if post.metadata.get('hidden', False):
                print(f"Skipping hidden post: {post.metadata.get('title', 'Untitled')}: {filename}")
                continue

            slug = os.path.splitext(filename)[0]
            post_dir = filepath.parent

            banner_image = post.metadata.get('image', '')
            if banner_image:
                new_banner = process_image(banner_image, post_dir)
                post.metadata['image'] = new_banner

            process_content = process_post_content(post.content, post_dir)

            post_data = {
                'id': len(posts)+1,
                'slug': slug,
                'title': post.metadata.get('title', 'Untitled Post'),
                'excerpt': post.metadata.get('excerpt', ''),
                'date': post.metadata.get('date', datetime.now().strftime('%B %d, %Y')),
                'tags': post.metadata.get('tags', []),
                'image': post.metadata['image'],
                'content': process_content
            }
            
            posts.append(post_data)
            print(f"Finished post: {post_data['title']}")
    

    save_cache()
    posts.sort(key=lambda x: datetime.strptime(x['date'], '%B %d, %Y'), reverse=True)

    for i, post in enumerate(posts):
        post['id'] = i +1

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"Finished all {len(posts)} posts. Output={OUTPUT_FILE}")
    print(f"Processed {len(processed_images)} images")

if __name__ == "__main__":
    process_posts()