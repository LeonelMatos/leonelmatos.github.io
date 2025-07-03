// Import components
import { renderHeader } from './components/ui/header.js';
import { renderNavigation } from './components/ui/navigation.js';
import { renderBlogSection } from './components/sections/blog.js';
import { renderProjectsSection } from './components/sections/projects.js';
import { renderFooter } from './components/ui/footer.js';

// DOM Elements
const elements = {
    headerContainer: document.getElementById('headerContainer'),
    navigationContainer: document.getElementById('navigationContainer'),
    blogContainer: document.getElementById('blogContainer'),
    projectsContainer: document.getElementById('projectsContainer'),
    moviesContainer: document.getElementById('moviesContainer'),
    toolsContainer: document.getElementById('toolsContainer'),
    bookmarksContainer: document.getElementById('bookmarksContainer'),
    footerContainer: document.getElementById('footerContainer'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    userIdDisplay: document.getElementById('userIdDisplay'),
    currentUserId: document.getElementById('currentUserId')
};

// Application State
const state = {
    darkMode: localStorage.getItem('theme') === 'dark'
};

// Core Functions
const initializeApp = () => {
    console.log("App is loading...");
    try {
        // Render UI
        renderUI();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize theme
        setupTheme();
        
        console.log("App initialized successfully!");
    } catch (error) {
        console.error("App initialization failed:", error);
    }
};

const renderUI = () => {
    if (elements.headerContainer) elements.headerContainer.innerHTML = renderHeader();
    if (elements.navigationContainer) elements.navigationContainer.innerHTML = renderNavigation();
    if (elements.blogContainer) elements.blogContainer.innerHTML = renderBlogSection();
    if (elements.projectsContainer) elements.projectsContainer.innerHTML = renderProjectsSection();
    if (elements.footerContainer) elements.footerContainer.innerHTML = renderFooter();
    
    // Initialize other sections with placeholders
    if (elements.moviesContainer) elements.moviesContainer.innerHTML = "<section class='p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm'><h2 class='text-2xl font-semibold mb-4'>Movies & Shows</h2><p>Movie section placeholder</p></section>";
    if (elements.toolsContainer) elements.toolsContainer.innerHTML = "<section class='p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm'><h2 class='text-2xl font-semibold mb-4'>Tools I Use</h2><p>Tools section placeholder</p></section>";
    if (elements.bookmarksContainer) elements.bookmarksContainer.innerHTML = "<section class='p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm'><h2 class='text-2xl font-semibold mb-4'>Bookmarks</h2><p>Bookmarks section placeholder</p></section>";
};

// Theme Management
const setupTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        state.darkMode = true;
    } else {
        document.documentElement.classList.remove('dark');
        state.darkMode = false;
    }
    
    updateDarkModeIcon();
};

const updateDarkModeIcon = () => {
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    
    if (!moonIcon || !sunIcon) return;
    
    if (state.darkMode) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
};

// UI Interactions
const setupEventListeners = () => {
    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
};

const toggleDarkMode = () => {
    const html = document.documentElement;
    state.darkMode = !state.darkMode;
    
    if (state.darkMode) {
        html.classList.add('dark');
        html.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.add('light');
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    
    updateDarkModeIcon();
};

const smoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);