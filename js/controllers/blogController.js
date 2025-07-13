import { renderFullPost } from '../components/sections/blog.js';

export default class BlogController {
    constructor() {
        this.container = null;
        this.escHandler = null;
        this.initContainer();
        this.setupEventListeners();
    }

    initContainer() {
        // Create or reuse fullscreen container
        this.container = document.getElementById('fullPostContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'fullPostContainer';
            this.container.className = 'fixed inset-0 z-50 hidden overflow-y-auto bg-black/50 backdrop-blur-sm';
            document.body.appendChild(this.container);
        }
    }

    setupEventListeners() {
        // Event delegation for all blog cards
        document.addEventListener('click', (e) => {
            const blogCard = e.target.closest('.blog-card, .blog-preview-card');
            if (blogCard) {
                const postId = blogCard.dataset.id;
                this.showFullPost(postId);
            }
        });
    }

    showFullPost(postId) {
        this.container.innerHTML = renderFullPost(postId);
        this.container.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        // Add back button event
        document.getElementById('back-to-posts').addEventListener('click', () => this.hideFullPost());

        // Add click outside to close
        /*const postCard = this.container.querySelector('.post-card');
        this.container.addEventListener('click', (e) => {
            if (postCard && !postCard.contains(e.target)) {
                this.hideFullPost();
            }
        });*/

        // Add ESC key support
        this.escHandler = (e) => {
            if (e.key === 'Escape') this.hideFullPost();
        };
        document.addEventListener('keydown', this.escHandler);
    }

    hideFullPost() {
        this.container.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        
        // Clean up event listeners
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
            this.escHandler = null;
        }
    }
}