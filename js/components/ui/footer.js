export const renderFooter = () => {
    const currentYear = new Date().getFullYear();
    return `
      <footer class="max-w-4xl mx-auto py-8 text-center text-neutral-600 dark:text-neutral-400 text-sm mt-8 border-t border-neutral-300 dark:border-neutral-700 rounded-lg">
        <p>&copy; ${currentYear} Leonel Matos.</p>
        <p class="mt-1"><b>email</b>: <a href="mailto:leonellmts@gmail.com" class="hover:underline">leonellmts@gmail.com</a></p>
        <p class="mt-1"><b>personal links</b>: 
        <a href="https://github.com/LeonelMatos" class="hover:underline">Github</a> • 
        <a href="http://www.linkedin.com/in/leonel-matos" class="hover:underline">LinkedIn</a></p>
      </footer>
    `;
};