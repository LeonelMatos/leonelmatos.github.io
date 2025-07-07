export const renderNavigation = () => {
  return `
    <h2 class="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-50 border-b pb-2 border-neutral-300 dark:border-neutral-700">Categories</h2>
    <nav>
      <ul class="space-y-3">
        <li>
          <a href="#blog" class="flex items-center text-lg text-neutral-800 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 py-2">
            All Posts
          </a>
        </li>
        <li>
          <a href="#projects" class="flex items-center text-lg text-neutral-800 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 py-2">
            GameDev Projects
          </a>
        </li>
        <li>
          <a href="#tools" class="flex items-center text-lg text-neutral-800 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 py-2">
            GameDev Tools
          </a>
        </li>
        <li>
          <a href="#movies" class="flex items-center text-lg text-neutral-800 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 py-2">
            Movies & Series
          </a>
        </li>
        <li>
          <a href="#music" class="flex items-center text-lg text-neutral-800 dark:text-neutral-200 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 py-2">
            Music Production
          </a>
        </li>
      </ul>
    </nav>
  `;
};