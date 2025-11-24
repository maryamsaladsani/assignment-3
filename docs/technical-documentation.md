# 🧠 Technical Documentation

## 1️⃣ Overview
This document explains the internal structure, technologies, and logic behind the **Maryam Aladsani Portfolio Website**.  
It demonstrates the technical design, implementation details, and reasoning behind each feature.

---

## 2️⃣ Technologies Used
| Area | Technology | Purpose |
|------|-------------|----------|
| **Frontend** | HTML5 | Defines the page structure and semantic content. |
|  | CSS3 | Handles layout, responsive design, animations, and transitions. |
|  | JavaScript (ES6) | Adds interactivity, event handling, and data storage. |
| **Development Tools** | IntelliJ IDEA | Used for development and testing. |
| **Version Control** | Git & GitHub | Source management and deployment. |

---
##  3️⃣  Core Features and Logic

#### 3.1 Dynamic Greeting
Displays a personalized greeting such as “Good morning, Maryam!”, based on the time of day and saved username.
Stores the username in localStorage and hides the input form after submission.
Provides a Change name button to edit the stored name.

Purpose: Demonstrates both Dynamic Content and Data Handling.

#### 3.2 Contact Form Validation
* Validates name, email, and message fields before submission.
* Provides inline feedback using visual highlights and text messages.
* Displays loading, success, and error states dynamically.
 
Key Concepts
* Event listeners (submit, input, blur).
* Regular expressions for email validation.
* Accessibility via aria-live and aria-invalid.

#### 3.3 Scroll Progress Bar
* A thin horizontal bar fills across the top of the page as the user scrolls.
* Updates width dynamically using JavaScript to calculate scroll progress:
* Uses CSS transitions for smooth animation (transition: width 0.08s linear).

#### 3.4 Dark/Light Theme Toggle
* Allows the user to switch between light and dark color themes.
* Automatically applies the saved theme on reload.
  Example CSS


## 4️⃣ Performance Considerations
* Pure HTML/CSS/JS — no heavy frameworks.
* Optimized images in /assets/images/ for faster load.
* CSS transitions use hardware-accelerated properties (transform, opacity).
* Efficient event listeners and minimal DOM manipulation.

##  5️⃣ AI Integration (Summary)
AI tools assisted in:
* Generating and refining code for the greeting feature, form validation, and scroll progress bar.
* Debugging event-handling logic.
* Reviewing accessibility and performance optimizations.
  Full details documented in [docs/ai-usage-report.md.]()

##  6️⃣ File Structure
```plaintext
/
├── index.html                  # Main webpage
├── css/
│   └── styles.css              # Styling and animations
├── js/
│   └── script.js               # JavaScript for interactivity
├── docs/
│   ├── ai-usage-report.md      # AI documentation
│   └── technical-documentation.md  # (this file)
└── assets/
    └── images/                 # Profile picture, skill icons, etc.
