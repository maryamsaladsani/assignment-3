# Technical Documentation

## Overview
This portfolio website demonstrates advanced web development skills including API integration, state management, dynamic content, and form validation. Built with vanilla HTML, CSS, and JavaScript.

---

## Technologies Used
| Area                  | Technology | Purpose |
|-----------------------|-------------|----------|
| **Frontend**          | HTML5 | Semantic structure and accessibility |
|                       | CSS3 | Responsive design, animations, theme system |
|                       | JavaScript (ES6) | Interactivity, API calls, state management  |
| **Development Tools** | IntelliJ IDEA | Used for development and testing. |
| **Version Control**   | Git & GitHub | Source management and deployment. |
| **API**               | GitHub API  | Fetch and display repositories dynamically  |
## File Structure

```
assignment-3/
├── index.html
├── css/
│   ├── styles.css          # Base styles, theme variables
│   ├── skills.css          # About/Skills section
│   ├── projects.css        # GitHub projects section
│   ├── volunteering.css    # Timeline component
│   └── contact.css         # Contact form styles
├── js/
│   ├── contact.js           
│   ├── greeting.js         
│   ├── scroll-progress.js        
│   ├── theme.js           
│   ├── github-api.js       # GitHub API integration
│   └── volunteering.js     # Timeline filtering
├── assets/images/
└── docs/
    ├── ai-usage-report.md
    └── technical-documentation.md
```

---

## API Integration

### GitHub API

**Purpose:** Display my latest repositories dynamically

**Implementation:**
- Fetches repos from `https://api.github.com/users/maryamsaladsani/repos`
- Filters out forked repos
- Sorts by most recently updated
- Displays top 6 with language, description, and topics

**Error Handling:**
- Loading state while fetching
- Error message with retry button if fetch fails
- Graceful fallback if no repos found

**Code Location:** `js/github-api.js`

---

## Complex Logic

### 1. Dynamic Greeting
Displays personalized time-based greeting (morning/afternoon/evening) with saved username.

**Logic:**
- Checks current hour to determine time of day
- Saves username to localStorage
- Shows/hides input form based on saved state
- "Change name" button to update stored name

### 2. Contact Form Validation
Multi-field validation with inline feedback.

**Validation Rules:**
- Name: Minimum 2 characters
- Email: Valid format (regex: `/^\S+@\S+\.\S+$/`)
- Message: Minimum 10 characters

**Features:**
- Real-time validation on input/blur
- Visual error highlights (red border)
- Inline success/error messages
- Loading state during submission
- Prefills saved name/email from localStorage

### 3. Volunteering Timeline Filter
Clickable timeline items with expand/collapse and filtering.

**Logic:**
- Click any item to expand description
- Auto-closes other expanded items
- Updates item counts dynamically

### 4. Scroll Progress Bar
Horizontal bar that fills as you scroll down the page.

---

## State Management

### localStorage Usage

**Stored Data:**
1. `theme` - User's theme preference (light/dark)
2. `username` - Saved name for greeting
3. `contact_name` - Prefill name in contact form
4. `contact_email` - Prefill email in contact form

**Implementation:**
- Checks localStorage availability before use
- Loads saved state on page load
- Updates localStorage on user actions


### Theme System

**Features:**
- Toggle between light and dark mode
- Saves preference to localStorage
- Uses CSS variables for easy switching
- Respects system preference on first visit

---

## Performance Optimization

### Lighthouse Scores

**Desktop Performance:**
- **Performance:** 99/100
- **Accessibility:** 96/100
- **Best Practices:** 100/100
- **SEO:** 91/100

**Mobile Performance:**
- **Performance:** 99/100
- **Accessibility:** 95/100
- **Best Practices:** 100/100
- **SEO:** 91/100

---

**Last Updated:** November 2025