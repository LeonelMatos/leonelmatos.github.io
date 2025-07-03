// Dark Mode Toggle with Current Mode Icons
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Create SVG container
    const iconContainer = document.createElement('div');
    iconContainer.id = 'themeIcon';
    iconContainer.className = 'w-6 h-6';
    darkModeToggle.appendChild(iconContainer);
    
    // Function to load SVG icon
    const loadIcon = async (iconName) => {
        try {
            // Determine the correct icon path
            const iconPath = `/assets/icons/${iconName}_mode.svg`;
            
            // Fetch the SVG
            const response = await fetch(iconPath);
            if (!response.ok) throw new Error('Icon not found');
            
            const svgText = await response.text();
            iconContainer.innerHTML = svgText;
            
            // Add styling to SVG
            const svg = iconContainer.querySelector('svg');
            if (svg) {
                svg.classList.add('w-full', 'h-full');
            }
        } catch (error) {
            console.error('Error loading icon:', error);
            // Fallback to simple SVG
            if (iconName === 'light') {
                iconContainer.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                `;
            } else {
                iconContainer.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                `;
            }
        }
    };
    
    // Update icon based on current theme
    const updateIcon = () => {
        const isDark = html.classList.contains('dark');
        loadIcon(isDark ? 'dark' : 'light');
    };
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        updateIcon();
    };
    
    // Initialize theme
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            html.classList.add('dark');
        }
        
        updateIcon();
    };
    
    // Event listeners
    darkModeToggle.addEventListener('click', toggleDarkMode);
    initTheme();
});