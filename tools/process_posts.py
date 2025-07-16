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

#Convert image to webp
def convert_to_webp(src_path: Path) -> Path:
    dest = LOCAL_WEBP_DIR / (src_path.stem + '.webp')
    if not dest.exists():
        subprocess.run([
            'ffmpeg', '-y', '-i', str(src_path), '-compression-level', '6',
            '-qscale', '80', str(dest)
        ], check=True)
    return dest

#Upload local images to r2
def upload_to_r2(local_path: Path, key: str):
    remote = f"{RCLONE_REMOTE}{R2_BUCKET}/{R2_PREFIX}{key}"
    subprocess.run([
        'rclone', 'copyto', str(local_path), remote
    ], check=True)
    return R2_BASE_URL + key

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

def process_posts(input_dir: Path, output_file: Path):
    posts = []
    valid_files = [f for f in os.listdir(input_dir) if f.endswith('.md')]

    for filename in valid_files:
        filepath = os.path.join(input_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)

            #Skip hidden posts
            if post.metadata.get('hidden', False):
                print(f"Skipping hidden post: {filename} : {post.metadata.get('title', 'Untitled')}")
                continue

            slug = os.path.splitext(filename)[0]
            post_data = {
                'id': len(posts)+1,
                'slug': slug,
                'title': post.metadata.get('title', 'Untitled Post'),
                'excerpt': post.metadata.get('excerpt', ''),
                'date': post.metadata.get('date', datetime.now().strftime('%B %d, %Y')),
                'tags': post.metadata.get('tags', []),
                'image': post.metadata.get('image', []),
                'content': markdown.markdown(post.content)
            }
            
            posts.append(post_data)
    
    posts.sort(key=lambda x: datetime.strptime(x['date'], '%B %d, %Y'), reverse=True)

    for i, post in enumerate(posts):
        post['id'] = i +1

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"Processed {len(posts)} posts. Output: {output_file}")

if __name__ == "__main__":
    #Config
    BLOG_POSTS_DIR = '../blogposts'
    OUTPUT_FILE = '../js/data/posts.json'

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    process_posts(BLOG_POSTS_DIR, OUTPUT_FILE)