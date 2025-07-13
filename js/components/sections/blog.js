const tagColors = {
  gamedev: 'bg-blue-100 text-blue-800',
  linux: 'bg-green-100 text-green-800',
  emulation: 'bg-purple-100 text-purple-800',
  tools: 'bg-amber-100 text-amber-800',
  tutorial: 'bg-rose-100 text-rose-800',
  default: 'bg-gray-100 text-gray-800'
};

const blogPosts = [
  {
    id: 1,
    title: "How to Configure and Use the DERP Emulator for PicoSystem on Linux",
    excerpt: "Create an environment to try and test different retro games build for the PicoSystem",
    date: "June 15, 2025",
    tags: ["linux", "emulation", "picosystem"],
    category: "GameDev Tools",
    image: "https://pub-a4b70c46df844f5898a5a6145cee21c9.r2.dev/post3-banner.png",
    content: `<p>Full content would go here...</p>`
  },
  {
    id: 2,
    title: "Roadside Picnic Game Development Insights",
    excerpt: "Following the game development and insanity to build a 3D survival game based on the concepts from the book Roadside Picnic.",
    date: "June 8, 2025",
    tags: ["gamedev", "unity", "3d"],
    category: "GameDev Projects",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
    content: `<p>Full content would go here...</p>`
  },
  {
    id: 3,
    title: "My Essential Tool Stack for Game Development",
    excerpt: "A curated list of tools that accelerate my development workflow and boost productivity",
    date: "June 1, 2025",
    tags: ["tools", "workflow", "productivity"],
    category: "GameDev Tools",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
    content: `<p>Full content would go here...</p>`
  }
];

//Blog page cards on list view
export const renderBlogList = () => {
  return `
    <div class="space-y-6">
      ${blogPosts.map(post => `
        <article 
          class="blog-card cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
          data-id="${post.id}"
        >
          <div class="flex flex-col sm:flex-row">
            <div class="sm:w-2/5 flex-shrink-0">
              <img 
                src="${post.image}" 
                alt="${post.title}" 
                class="w-full h-48 object-cover"
                loading="lazy"
              >
            </div>
            <div class="sm:w-3/5 p-4 flex flex-col">
              <div class="flex flex-wrap gap-1 mb-2">
                ${post.tags.map(tag => `
                  <span class="text-xs font-medium px-2 py-1 rounded-full ${tagColors[tag] || tagColors.default}">
                    ${tag}
                  </span>
                `).join('')}
              </div>
              <h3 class="font-semibold line-clamp-2 mb-2 text-lg text-neutral-900 dark:text-neutral-50">
                ${post.title}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                ${post.excerpt}
              </p>
              <div class="mt-auto text-xs text-neutral-500 dark:text-neutral-400">
                ${post.date}
              </div>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};

export const renderBlogSection = () => {
  const recentPosts = blogPosts.slice(0, 3);
  
  return `
    <section id="blog">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Latest Blogposts</h2>
        <a href="blog.html" class="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
          View All →
        </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${recentPosts.map(post => `
          <article 
            class="blog-preview-card group bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            data-id="${post.id}"
          >
            <div class="h-40 overflow-hidden">
              <img 
                src="${post.image}" 
                alt="${post.title}" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
            </div>
            <div class="p-5">
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                ${post.category}
              </span>
              <h3 class="font-medium mt-1 mb-2 text-lg leading-tight text-neutral-900 dark:text-neutral-50">
                ${post.title}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                ${post.excerpt}
              </p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-neutral-500 dark:text-neutral-400">${post.date}</span>
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Read more
                </span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
};

export const renderBlogPosts = () => {
  return `
    <section class="space-y-8">
      ${blogPosts.map(post => `
        <article id="post-${post.id}" class="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm">
          <div class="h-64 overflow-hidden">
            <img 
              src="${post.image}" 
              alt="${post.title}" 
              class="w-full h-full object-cover"
            >
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  ${post.category}
                </span>
                <h2 class="text-2xl font-semibold mt-1 mb-3 text-neutral-900 dark:text-neutral-50">
                  ${post.title}
                </h2>
              </div>
              <span class="text-sm text-neutral-500 dark:text-neutral-400">${post.date}</span>
            </div>
            
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-neutral-700 dark:text-neutral-300 mb-4">
                ${post.excerpt}
              </p>
              <p class="text-neutral-700 dark:text-neutral-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
                nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies 
                nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
                nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              </p>
              <p class="text-neutral-700 dark:text-neutral-300">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            
            <div class="mt-6 flex flex-wrap gap-2">
              ${post.tags.map(tag => `
                <span class="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full">
                  ${tag}
                </span>
              `).join('')}
            </div>
          </div>
        </article>
      `).join('')}
    </section>
  `;
};

// Render full post view with monospace back button
export const renderFullPost = (postId) => {
  const post = blogPosts.find(p => p.id == postId);
  if (!post) return '<p>Post not found</p>';
  
  return `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="post-card bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4">
          <button 
            id="back-to-posts"
            class="font-mono text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            ← All posts [Esc]
          </button>
        </div>
        
        <div class="p-6">
          <img 
            src="${post.image}" 
            alt="${post.title}" 
            class="w-full h-64 object-cover rounded-lg mb-6"
          >
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${post.tags.map(tag => `
              <span class="text-xs font-medium px-3 py-1 rounded-full ${tagColors[tag] || tagColors.default}">
                ${tag}
              </span>
            `).join('')}
          </div>
          
          <h1 class="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
            ${post.title}
          </h1>
          
          <div class="prose dark:prose-invert max-w-none">
            ${post.content}
          </div>
        </div>
      </div>
    </div>
  `;
};