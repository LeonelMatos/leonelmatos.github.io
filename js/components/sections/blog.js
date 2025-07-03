export const renderBlogSection = () => {
    return `
      <section id="blog" class="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm">
        <h2 class="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-50 border-b pb-2 border-neutral-300 dark:border-neutral-700">Latest Blogposts</h2>
        <div class="bg-white dark:bg-neutral-900 p-4 rounded-md shadow-inner">
          <h3 class="text-xl font-medium">Sample Blog Post</h3>
          <p class="text-neutral-700 dark:text-neutral-300">This is a sample blog post. Real content will appear here later.</p>
        </div>
      </section>
    `;
};