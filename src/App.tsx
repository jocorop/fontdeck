/*
 * Copyright (C) 2025 jocorop
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';
import { FontList } from './components/Font/FontList';
import { useStore } from './store/useStore';
import { FontDetailsView } from './components/Font/FontDetailsView';
import { ContextMenu } from './components/UI/ContextMenu';
import { ConsentBanner } from './components/ConsentBanner';
import { InfoModal } from './components/UI/InfoModal';
import { DragOverlay } from './components/UI/DragOverlay';
import { useFontLoader } from './hooks/useFontLoader';
import './i18n';

function App() {
  const { activeView, accentColor, loadFromPersistence, isInitialLoad } = useStore();
  const { handleDrop } = useFontLoader();
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    loadFromPersistence();
    document.documentElement.style.setProperty('--color-accent', accentColor);

    // Dynamic Favicon Update
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    const safeColor = hexRegex.test(accentColor) ? accentColor : '#00E676';

    const svgIcon = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="32" height="32" rx="0" fill="#111111" />
        <rect x="4" y="6" width="20" height="20" rx="4" transform="rotate(-15 14 16)" fill="${safeColor}44" stroke="${safeColor}" stroke-width="2" />
        <rect x="6" y="6" width="20" height="20" rx="4" transform="rotate(-5 16 16)" fill="#222" stroke="#ffffff88" stroke-width="2" />
        <rect x="8" y="6" width="20" height="20" rx="4" transform="rotate(5 18 16)" fill="${safeColor}" stroke="${safeColor}" stroke-width="0" />
        <path d="M16 12H22M16 16H20M16 12V20" stroke="#111" stroke-width="2.5" stroke-linecap="round" transform="rotate(5 18 16) translate(2, 0)" />
      </svg>
    `;

    // Safety check for browser environment
    if (typeof window !== 'undefined') {
      const encoded = encodeURIComponent(svgIcon);
      const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = `data:image/svg+xml;charset=utf-8,${encoded}`;
      document.head.appendChild(link);
    }
  }, [accentColor]);

  const onDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const onDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging false if we are leaving the window
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleDrop(e);
  }, [handleDrop]);


  // Prevent flash of default content (settings not loaded)
  if (isInitialLoad) {
    return <div className="h-screen w-screen bg-background flex items-center justify-center text-muted"></div>;
  }

  return (
    <div
      className="flex h-screen w-screen bg-background text-text overflow-hidden font-sans select-none color-scheme-dark"
    >
      <Sidebar />
      <div
        className="flex-1 flex flex-col h-full min-w-0 relative z-0"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <TopBar />
        <div className="flex-1 flex flex-col min-h-0 relative">
          {activeView === 'list' ? <FontList /> : <FontDetailsView />}

          {/* Toast Notification */}
          <Toast />
          <ContextMenu />
          <ConsentBanner />
          <InfoModal />
          <DragOverlay isVisible={isDragging} />

          {/* Gradient overlay for bottom fade if desired, or removed for clean look */}
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t from-background to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  );
}

const Toast = () => {
  const toastMessage = useStore(state => state.toastMessage);
  if (!toastMessage) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-surface text-text px-6 py-4 rounded-lg shadow-2xl border border-accent animate-in fade-in slide-in-from-right-8 duration-300 z-50 flex items-start space-x-3 max-w-[500px]">
      <span className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0 animate-pulse"></span>
      <span className="font-medium leading-relaxed">{toastMessage}</span>
    </div>
  );
};

export default App;
