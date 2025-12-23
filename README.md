# FontDeck - Advanced Font Manager

**FontDeck** is a high-performance, aesthetically pleasing font management tool designed for designers and developers. Built with modern web technologies, it offers a fast, reactive, and intuitive interface for organizing, previewing, and managing your local and web fonts.

![FontDeck Preview](./public/favicon.svg) <!-- Replace with actual screenshot if available -->

## 🚀 Features

*   **⚡ Blazing Fast Performance**:
    *   **Virtual Scrolling**: Handles thousands of fonts with zero lag using `react-window`.
    *   **Instant Startup**: Remembers your preferences (Theme, Locale, Size) with zero loading time.
*   **🎨 Stunning UI/UX**:
    *   **Reactive Design**: Smooth 0.5s transitions for all color and theme changes.
    *   **Eye Follower**: Engaging interactive element in the welcome screen.
    *   **Dark/Light Mode**: Professional themes inspired by top-tier design tools.
    *   **Accent Colors**: Custom color palettes (Purple, Green, Orange, etc.).
*   **🌍 Internationalization**: Full support for **English** and **Spanish** (Español).
*   **📂 Smart Management**:
    *   **Strict Deduplication**: Automatically detects and discards duplicate fonts based on content hash (SHA-256), keeping your library clean.
    *   **Collections**: Create custom collections (e.g., "Logo Fonts", "Script").
    *   **Delete**: Right-click to delete collections.
    *   **Favorites**: Quick access to your top fonts.
    *   **Drag & Drop**: Simply drag font files to install. Supports `ttf`, `otf`, `woff`, `woff2`.
    *   **Format Handling**: Intelligent detection for `afm`, `pfa`, `sfd`, `fea` and more, with detailed notifications for unsupported formats.
*   **🛡️ Enterprise-Grade Security**:
    *   **DoS Protection**: Prevents crashes by rejecting massive files (>20MB) instantly.
    *   **Anti-Tamper**: Production builds are hardened (No source maps, stripped logs, obfuscated).
    *   **CSP**: Strict Content Security Policies for browser safety.
*   **🔎 SEO & PWA Ready**:
    *   **Rich Snippets**: JSON-LD Structured Data for search engines.
    *   **Social Cards**: Optimized for Sharing on Twitter/X and Discord.
    *   **PWA**: Mobile-ready metadata.
*   **📐 Advanced Rendering**:
    *   **RTL Support**: Correct alignment and display for Right-to-Left languages (Hebrew, Arabic).
    *   **Style Preservation**: Fonts render immediately with correct styles (no FOUC).
    *   **Scroll Memory**: Remembers your position in the list when navigating details.
*   **💾 Robust Persistence**:
    *   **IndexedDB**: securely stores your font metadata and collections.
    *   **LocalStorage**: Syncs your UI preferences instantly.

## 🛠️ Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **State Management**: Zustand
*   **Styling**: TailwindCSS, Vanilla CSS (Variables)
*   **Icons**: Lucide React
*   **I18n**: i18next
*   **Font Parsing**: opentype.js
*   **Optimization**: react-window, IDB (IndexedDB wrapper)

## 📦 Installation & Usage

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jocorop/fontdeck.git
    cd fontdeck
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📖 How to Use

1.  **Add Fonts**: Drag and drop font files anywhere onto the list view, or click "Local" and allow folder access (if supported).
2.  **Preview**: Type any text in the top bar to preview it across all fonts instantly.
3.  **Adjust Size**: Use the slider in the top bar to change the preview size.
4.  **Manage Collections**:
    *   Right-click a font -> "Add to Collection".
    *   Click "New Collection" in the sidebar to create one.
    *   Right-click a collection in the sidebar to **Delete** it.
5.  **Change Theme/Language**: Use the buttons in the top right to toggle Dark/Light mode, change Language (EN/ES), or pick a new Accent Color.

## 🤝 Support & Credits

**FontDeck** is developed and maintained by **[@jocorop](https://github.com/jocorop)**.

If you find this tool useful, consider buying me a coffee! Your support helps keep the project alive and fuels new features.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/hadashnova)

---
*Built with ❤️ for Typography Enthusiasts.*
