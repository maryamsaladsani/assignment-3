// GitHub API Integration with error handling and loading states
(function() {
    'use strict';

    // Configuration
    const GITHUB_USERNAME = 'maryamsaladsani'; // Your GitHub username
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    const MAX_REPOS = 6; // How many repos to display

    // DOM Elements
    const projectsContainer = document.getElementById('projects-container');
    const loadingIndicator = document.getElementById('projects-loading');
    const errorContainer = document.getElementById('projects-error');
    const retryButton = document.getElementById('retry-fetch');

    // Check if elements exist
    if (!projectsContainer) {
        console.warn('Projects container not found. GitHub API integration skipped.');
        return;
    }

    /**
     * Fetch GitHub repositories
     */
    async function fetchGitHubRepos() {
        try {
            showLoading();
            hideError();

            const response = await fetch(API_URL, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
            }

            const repos = await response.json();

            // Filter and sort repositories
            const filteredRepos = repos
                .filter(repo => !repo.fork) // Exclude forked repositories
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by most recently updated
                .slice(0, MAX_REPOS); // Limit to MAX_REPOS

            hideLoading();
            displayRepos(filteredRepos);

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            hideLoading();
            showError(error.message);
        }
    }

    /**
     * Display repositories in the DOM
     */
    function displayRepos(repos) {
        if (!repos || repos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-repos">
                    <p>No repositories found. Check back later!</p>
                </div>
            `;
            return;
        }

        projectsContainer.innerHTML = repos.map(repo => createRepoCard(repo)).join('');
    }

    /**
     * Create HTML for a single repository card
     */
    function createRepoCard(repo) {
        const description = repo.description || 'No description available';
        const language = repo.language || 'Unknown';
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <article class="project-card" data-language="${language.toLowerCase()}">
                <div class="project-header">
                    <h3 class="project-title">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                            ${repo.name}
                        </a>
                    </h3>
                    ${repo.language ? `<span class="project-language">${repo.language}</span>` : ''}
                </div>
                
                <p class="project-description">${description}</p>
                
                <div class="project-meta">
                    <span class="project-date" title="Last updated">
                        🕒 ${updatedDate}
                    </span>
                </div>
                
                ${repo.topics && repo.topics.length > 0 ? `
                    <div class="project-topics">
                        ${repo.topics.slice(0, 3).map(topic =>
            `<span class="topic-tag">${topic}</span>`
        ).join('')}
                    </div>
                ` : ''}
            </article>
        `;
    }

    /**
     * Show loading indicator
     */
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
        if (projectsContainer) {
            projectsContainer.innerHTML = '';
        }
    }

    /**
     * Hide loading indicator
     */
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            const errorMessage = errorContainer.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = `Unable to load projects: ${message}`;
            }
        }
    }

    /**
     * Hide error message
     */
    function hideError() {
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
    }

    /**
     * Retry button handler
     */
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            fetchGitHubRepos();
        });
    }

    /**
     * Initialize - fetch repos on page load
     */
    function init() {
        // Fetch immediately on load
        fetchGitHubRepos();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();