# 🚀 Personal Portfolio Website - Md. Iftekharul Islam

[![GitHub Pages Deployment](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?logo=github)](https://ifti136.github.io/)
![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=threedotjs)
![No Build Step](https://img.shields.io/badge/Build-None-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

Welcome to my personal portfolio website! This project showcases my research, projects, skills, and social connections in an interactive and visually appealing way, with a subtle 3D background and smooth animations. 🌌

## 📌 Features

- 🌐 **Subtle 3D Background** - a slow-moving Three.js node network that reacts to your mouse and scroll
- 🪞 **Tilting Hero Photo** - a soft 3D tilt that follows the pointer
- 🌙 **Dark/Light Mode** - follows your system setting, with a manual toggle that is remembered
- ✍️ **Content Lives in One File** - update everything from `data/content.json`, no HTML editing
- 🎨 **Modern and Responsive UI** - sticky section titles, timelines, project cards, and mobile menu
- 📈 **Scroll Progress Bar** and highlighted navigation for the section you are in
- 🛠 **Showcase of Projects with GitHub Links** and tech tags
- 📜 **Research Papers** with status badges (in progress, in preparation, published)
- 📱 **Social Media QR Code Integration**
- ♿ **Accessible** - keyboard focus, skip link, and reduced-motion support

## 🔗 Live Demo

[View Portfolio](https://ifti136.github.io/)

## 🛠 Technologies Used

- **HTML5** - Structure & SEO
- **CSS3** - Custom Styling, Variables & Animations
- **JavaScript (ES Modules)** - Rendering and Interactive Features
- **Three.js** - 3D Background Scene
- **JSON** - Content Data
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Bricolage Grotesque, Hanken Grotesk)
- **LocalStorage** - Theme Persistence

## 📂 Project Structure

```
📁 Portfolio
│── 📂 assets
│   ├── 📂 images
│   │   ├── profile-900.jpg
│   ├── 📂 qrcodes
│   ├── favicon.svg
│── 📂 data
│   ├── content.json  (All the website content)
│── 📂 scripts
│   ├── main.js    (Loads content and starts everything)
│   ├── render.js  (Builds the page from content.json)
│   ├── effects.js (Theme, menu, progress bar, tilt)
│   ├── scene.js   (Three.js 3D background)
│── 📂 styles
│   ├── main.css  (Handles styling)
│── index.html  (Page shell)
│── README.md  (Project documentation)
```

## ✍️ Updating the Content

Open `data/content.json` (on GitHub: open the file, click the ✏️ pencil icon, edit, commit). The page rebuilds itself from that file on every load.

| To do this | Edit this |
| --- | --- |
| Change the intro, tagline or buttons | `hero` |
| Add a degree | `education.items` |
| Add a paper | `research.items` (`status`: `progress`, `prep` or `published`; add `"link"` to make the title clickable) |
| Add a role, award or certificate | `activities.leadership` or `activities.achievements` |
| Add a project | `projects.items` (`"featured": true` makes a wide card) |
| Add a skill | a group in `skills.groups` |
| Add a social link | `contact.links` |
| Hide or reorder sections | the top-level `sections` list, or `"hidden": true` inside a section |

Example, adding a paper:

```json
{
  "title": "My New Paper Title",
  "authors": ["Md. Iftekharul Islam", "Co-author Name"],
  "status": "prep",
  "link": "https://doi.org/..."
}
```

> 💡 Mind the commas: every item in a list needs one after it except the last. If the page says the content could not be loaded, check the JSON with [jsonlint.com](https://jsonlint.com).

## 🎯 How to Use

1. Clone the repository:
   ```sh
   git clone https://github.com/ifti136/ifti136.github.io.git
   ```
2. Start a small local server (browsers block loading JSON from `file://`):
   ```sh
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.
4. Customize `data/content.json` and enjoy! ✨

## 💡 Future Improvements

- 📝 Blog Section for Articles
- 🌍 Multi-language support (Bangla/English)
- 📄 Downloadable CV button
- 🖼 Project screenshots in the project cards

## 🤝 Connect with Me

🔗 [GitHub](https://github.com/ifti136)  
🔗 [LinkedIn](https://www.linkedin.com/in/md-iftekharul-islam-7a953628a/)  
🔗 [Facebook](https://www.facebook.com/ifte603)  
🔗 [Telegram](https://t.me/+8801511713786)  

---

⭐ If you like this project, consider giving it a **star** on GitHub!
