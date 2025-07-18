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
    'R2_ACCOUNT_ID'
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

R2_BASE_URL = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{R2_BUCKET}/{R2_PREFIX}'

#Check dirs
LOCAL_WEBP_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

MD_IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")

#Track to avoid duplicates
processed_images = {}

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
        subprocess.run([
            'ffmpeg', '-y', '-i', str(src_path), '-compression-level', '6',
            '-qscale', '80', str(dest)
        ], check=True)
        print(f"Converted {src_path} to webp")
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
    webp_path = convert_to_webp(local_path)
    with open(webp_path, 'rb') as f:
        file_hash = hashlib.md5(f.read()).hexdigest()
    key = f"{file_hash}.webp"

    return upload_to_r2(webp_path, key)

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

            banner_image = post.metadada.get('image', '')
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
    
    posts.sort(key=lambda x: datetime.strptime(x['date'], '%B %d, %Y'), reverse=True)

    for i, post in enumerate(posts):
        post['id'] = i +1

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"Finished all {len(posts)} posts. Output={OUTPUT_FILE}")
    print(f"Processed {len(processed_images)} images")

if __name__ == "__main__":
    process_posts()