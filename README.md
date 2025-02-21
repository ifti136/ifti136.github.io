# Social Media Hub with QR Integration 🌐

[![GitHub Pages Deployment](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?logo=github)](https://your-username.github.io/repository-name)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, interactive landing page for showcasing social media profiles with QR code integration and advanced web features. Perfect for personal branding and quick connections!

## Features ✨

- **Dark/Light Mode Toggle** 🌟  
- **QR Code Hover Overlays** 📲  
- **Smooth Animations & Transitions** 🎮  
- **Web Share API Integration** 📤  
- **Scroll Progress Indicator** 📊  
- **Loading Screen Animation** ⏳  
- **Mobile-First Responsive Design** 📱  
- **Enhanced Accessibility (ARIA)** ♿  
- **SEO Optimized** 🔍  

## Tech Stack 💻

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Setup & Deployment 🚀

### 1. Clone Repository
```bash
git clone https://github.com/your-username/repository-name.git
cd repository-name
```

### 2. File Structure
```
your-repo/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   └── app.js
└── assets/
    ├── images/
    └── qrcodes/
```

### 3. Customization
- Replace placeholder images:
  - `assets/images/profile.jpg` - Your profile picture
  - `assets/qrcodes/*.png` - Your social media QR codes
- Update social links in `index.html`
- Modify colors in `styles/main.css`

### 4. Deploy to GitHub Pages
- Push to GitHub repository
- Go to **Settings → Pages**
- Set **branch:** `main`, **folder:** `/ (root)`

Your live URL:  
```arduino
https://your-username.github.io/repository-name
```

---

## Customization Guide 🎨

### Change Colors
```css
/* In styles/main.css */
:root {
  --primary-color: #1e3c72;
  --secondary-color: #2a5298;
  --accent-color: #f0f4ff;
}
```

### Add New Social Link
```html
<!-- In index.html -->
<div class="social-link">
  <h2>Platform Name</h2>
  <div class="qr-container">
    <img src="assets/qrcodes/new-qr.png" alt="...">
    <div class="qr-overlay">Scan to Connect</div>
  </div>
  <a href="YOUR_LINK" target="_blank" rel="noopener">Platform Name</a>
</div>
```
