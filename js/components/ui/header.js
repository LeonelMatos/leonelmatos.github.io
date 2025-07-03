export const renderHeader = () => {
    return `
      <header class="max-w-4xl mx-auto py-8 text-center border-b border-neutral-300 dark:border-neutral-700 rounded-lg mb-8">
        <h1 class="text-4xl sm:text-5xl font-bold mb-2 text-neutral-900 dark:text-neutral-50">Leonel Matos</h1>
        <p class="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
          Computer Science Student | Aspiring Game Developer | Good Listener
        </p>
        <p class="text-md text-neutral-600 dark:text-neutral-400 mt-2">
          Welcome to my personal website! It's a pleasure to meet you.
        </p>
        <div class="mt-4 flex justify-center space-x-4">
          <a href="https://github.com/LeonelMatos" target="_blank" rel="noopener noreferrer"
            class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
            aria-label="GitHub profile">
            <!-- GitHub Icon -->
          </a>
          <a href="http://www.linkedin.com/in/leonel-matos" target="_blank" rel="noopener noreferrer"
            class="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
            aria-label="LinkedIn profile">
            <!-- LinkedIn Icon -->
          </a>
        </div>
      </header>
    `;
};