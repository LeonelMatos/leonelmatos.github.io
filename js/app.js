// Import components
import { renderHeader } from './components/ui/header.js';
import { renderTopNavigation } from './components/ui/top-navigation.js';
import { renderNavigation } from './components/ui/navigation.js';
import { renderBlogSection } from './components/sections/blog.js';
import { renderProjectsSection } from './components/sections/projects.js';
import { renderFooter } from './components/ui/footer.js';
import './darkmode.js';

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
    userIdDisplay: document.getElementById('userIdDisplay'),
    currentUserId: document.getElementById('currentUserId')
};

// Render UI components
const renderUI = () => {
    if (elements.headerContainer) elements.headerContainer.innerHTML = renderHeader();
    if (elements.navigationContainer) elements.navigationContainer.innerHTML = renderNavigation();
    if (elements.blogContainer) elements.blogContainer.innerHTML = renderBlogSection();
    if (elements.projectsContainer) elements.projectsContainer.innerHTML = renderProjectsSection();
    if (elements.footerContainer) elements.footerContainer.innerHTML = renderFooter();
    if (elements.headerContainer) { 
        elements.headerContainer.innerHTML = renderHeader();
        const topNavContainer = document.getElementById('topNavigationContainer');
        if (topNavContainer) topNavContainer.innerHTML = renderTopNavigation();
    }
    // Initialize other sections with placeholders
    if (elements.moviesContainer) elements.moviesContainer.innerHTML = "<!-- Movie section content -->";
    if (elements.toolsContainer) elements.toolsContainer.innerHTML = "<!-- Tools section content -->";
    if (elements.bookmarksContainer) elements.bookmarksContainer.innerHTML = "<!-- Bookmarks section content -->";
};

// Initialize the app
document.addEventListener('DOMContentLoaded', renderUI);