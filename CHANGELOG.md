# Changelog

All notable changes to the **FontDeck** project will be documented in this file.

## v0.8.0 (2025-12-23)
**Security & Anti-Tamper "Lock Down"**
- **Security Hardening**:
    - **CSP Hardening**: Added `object-src 'none'` to block injection attacks.
    - **DoS Protection**: Enforced strict **20MB** file size limit per font to prevent memory exhaustion crashes.
    - **Anti-Clickjacking**: Investigated frame headers.
- **Anti-Tamper**:
    - **Source Maps Disabled**: Production builds no longer expose source code maps.
    - **Console Stripped**: Removed all `console` logs and debuggers via `esbuild`.
    - **Code Obfuscation**: Aggressive minification enabled.
- **SEO & Search**:
    - **Rich Snippets**: Added JSON-LD Structured Data (`SoftwareApplication` Schema).
    - **Social Cards**: Added Twitter/Open Graph meta tags.
    - **Mobile PWA**: Added `theme-color`.
- **UX & Polish**:
    - **Error Handling**: Localized "Local API" error messages (EN/ES) and added auto-dismiss (8s).
    - **Light Mode**: Fixed low contrast text for developer credits.

## v0.7.9
- **Interactive Drag & Drop**: Added a global, theme-aware overlay with blur effect when dragging files into the app.
- **Robust Scroll Memory**: Improved list scroll preservation using real-time tracking, ensuring exact position restoration when navigating back from details.
- **Localization Fixes**: Corrected swapped English/Spanish translations for drop interactions.
- **UX Polish**: Moved drop zone to workspace area to prevent sidebar interference.

## v0.7.7
- **Strict Content Deduplication**: Fonts are now hashed (SHA-256). Identical files (even with different names) are automatically discarded to prevent duplicates.
- **Enhanced Notifications**:
  - Unsupported format errors now list specific filenames.
  - Duration scales dynamically (5 seconds per error) to ensure readability.
  - Toasts now support multi-line text for long lists.
  - Duplicate errors in a single batch are consolidated.
- **Extended Format Recognition**: Added detection for `afm`, `fea`, `pfa`, `pfb`, `sfd`, `pt3`, `t42`, `tfm`, `vfb` (with clear "not supported" feedback).
- **Bug Fixes**:
  - Fixed startup crash related to file verification (`file.arrayBuffer`).
  - Resolved syntax errors in store and parser logic.
  - Fixed duplicate file counting in error reports.

## v0.7.5 (2025-12-23)
- **Feature**: Added support for additional file formats: AFM, FEA, PFA, PFB, SFD, PT3, T42, TFM, VFB.
  - Note: Unsupported render formats trigger a notification instead of a broken preview.
- **Fix**: Preserved scroll position in font list when navigating to/from details.
- **Fix**: Fixed FOUC (Flash of Unstyled Content) for font previews on reload.
- **Fix**: Improved RTL text alignment and added ellipsis for long text lines.
- **Fix**: Ensured correct copyright/license metadata extraction.

## [v0.7.1] - Rendering & UI Polish
### Added
- **Editable Size**: Users can now manually type the font size in the TopBar.

### Fixed
- **Rendering Consistency**: Fixed Waterfall and Glyphs tabs defaulting to system fonts for certain custom font files (now matches Styles tab logic).
- **UI Polish**: Improved styling of the value input to look seamless.

## [v0.7.0] - Interactive Lobby & Polish
### Added
- **Interactive Lobby**: Replaced empty state with a memory game to engage users ("Match the Typefaces").
- **Lobby Experience**: Added reactive blur and hover effects to the victory screen.
- **Ko-fi Integration**: Added support button and badge for project donations.
- **Localization**: Full English and Spanish support for the new Lobby and Info sections.

### Fixed
- **Contrast Issues**: Fixed text visibility problems in Light Mode (white theme) for the credits screen.
- **Security**: (Inherited from v0.6.0) DoS prevention, XSS hardening, and input sanitization.

## [v0.6.0] - Security & Stability Update
### Security (audit / patches)
- **DoS Prevention**: Implemented batched processing in `useFontLoader` to prevent browser crash/freeze when dropping thousands of fonts (Availability).
- **XSS Hardening**: Added strict Content-Security-Policy (CSP) headers to `index.html`.
- **Input Validation**: Added regex validation for `accentColor` to prevent injection attacks (Sanitization).
- **Anti-Spoofing**: Implemented strict sanitization for font metadata strings in `fontParser` to prevent UI DoS or layout breaking via malicious font files.

### Fixed
- **Startup Stability**: Fixed "Flash of Unstyled Content" and layout jumping by implementing `isInitialLoad` check to wait for persisted settings.
- **Persistence**: Fixed race condition where default font size (32px) would overwrite user preference on reload.

## [v0.5.0] - Refactoring & Optimization
### Added
- **Virtualization**: Implemented `react-window` for `FontList`, enabling high-performance scrolling for large font libraries.
- **Instant Startup**: Migrated UI settings (Theme, Locale, Color) to synchronous `localStorage`, eliminating startup flash/delay.
- **Refactoring**: Cleaned up `useStore` structure and centralized storage logic.

### Changed
- **Transition Speed**: Reduced global color transition from 1s to 0.5s for a snappier feel.
- **Documentation**: Added comprehensive `README.md` and `CHANGELOG.md`.

## [v0.4.0] - Persistence & Collections
### Added
- **Collection Deletion**: Users can now right-click collections in the sidebar to delete them.
- **Persistence**:
    - **UI Settings**: Language, Accent Color, and Preview Size are now persisted to DB/LocalStorage.
    - **Collections**: Full IndexedDB sync for collections and favorites.
- **Filtering**: Clicking a collection in the sidebar now filters the font list to that collection.

## [v0.3.0] - Internationalization (i18n)
### Added
- **Multi-language Support**: Added English (`en`) and Spanish (`es`) translations.
- **Language Switcher**: Toggle button in TopBar.
- **Persistence**: Selected language is saved and restored on reload.

## [v0.2.0] - Visuals & Branding (FontDeck)
### Changed
- **Rebranding**: Renamed application to **FontDeck**.
- **Logo**: Created reactive SVG favicon that changes color with the accent theme.
- **UI Polish**:
    - Added "Eye Follower" interactive component to the welcome screen.
    - Implemented smooth CSS variable-based color transitions.
    - Improved "Details" view card layout.

## [v0.1.0] - Initial Release
### Added
- Basic Font Listing & Parsing (`opentype.js`).
- Drag & Drop support.
- Sidebar navigation (Google, Local, Favorites).
- Zustand Store setup.
- Basic Theme toggle.
