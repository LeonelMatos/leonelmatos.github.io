export const renderTopNavigation = () => {
  return `
    <nav class="flex justify-center py-4 mb-6 border-b border-neutral-300 dark:border-neutral-700">
      <div class="flex space-x-6">
        <a href="/" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Home</a>
        <a href="blog.html" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Blog</a>
        <a href="#projects" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Projects</a>
        <a href="#movies" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Movies</a>
        <a href="#tools" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Tools</a>
        <a href="#bookmarks" class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Bookmarks</a>
      </div>
    </nav>
  `;
};