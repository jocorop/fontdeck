import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { useSystemFonts } from '../../hooks/useSystemFonts';
import { useFontLoader } from '../../hooks/useFontLoader';
import { useGoogleFonts } from '../../hooks/useGoogleFonts';
import { FolderOpen, Type, Star, Layers, Globe, Plus, Monitor, X, Check, Menu } from 'lucide-react';
import { Logo } from '../UI/Logo';

export const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const { fonts, collections, activeProvider, setActiveProvider, setActiveView, favorites, createCollection, addToCollection, openContextMenu, isSidebarCollapsed, toggleSidebar } = useStore();
    const { loadSystemFonts, loading, error } = useSystemFonts();
    const { openFilePicker } = useFontLoader();
    const { loadGoogleFonts, loading: googleLoading } = useGoogleFonts();

    // Inline Collection Creation State
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    const handleStartCreate = () => {
        if (isSidebarCollapsed) toggleSidebar(); // Auto expand
        setIsCreating(true);
        setNewCollectionName("");
    };

    const handleConfirmCreate = () => {
        if (newCollectionName.trim()) {
            createCollection(newCollectionName.trim());
        }
        setIsCreating(false);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    // Helper counts
    const addedCount = fonts.filter(f => !f.tags.includes('local') && !f.tags.includes('google')).length;
    const localCount = fonts.filter(f => f.tags.includes('local')).length;
    const googleCount = fonts.filter(f => f.tags.includes('google')).length;

    // Drag & Drop Handlers for Collections
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
        if (isSidebarCollapsed) toggleSidebar(); // Auto expand on drag hover
        e.currentTarget.classList.add('bg-surface'); // Highlight
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-surface');
    };

    const handleDrop = (e: React.DragEvent, collectionId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-surface');
        const fontId = e.dataTransfer.getData("fontId");
        if (fontId) {
            addToCollection(collectionId, fontId);
        }
    };

    return (
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-surface h-full flex flex-col flex-shrink-0 text-sm select-none border-r border-[#000000] transition-all duration-300 ease-in-out`}>
            {/* Header */}
            <div className={`p-5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isSidebarCollapsed && <Logo />}
                <button
                    onClick={toggleSidebar}
                    className="p-1 text-muted hover:text-text hover:bg-white/5 rounded-md transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-1 overflow-x-hidden">
                <div onClick={() => { setActiveProvider('all'); setActiveView('list'); }} className="cursor-pointer">
                    <SidebarItem icon={<Type size={16} />} label={t('sidebar.all')} count={fonts.length} active={activeProvider === 'all'} collapsed={isSidebarCollapsed} />
                </div>

                <div onClick={() => { setActiveProvider('added'); setActiveView('list'); }} className="cursor-pointer">
                    <SidebarItem
                        icon={<FolderOpen size={16} />}
                        label={t('sidebar.loaded')}
                        count={addedCount}
                        active={activeProvider === 'added'}
                        collapsed={isSidebarCollapsed}
                    />
                </div>

                <div onClick={() => { setActiveProvider('favorites' as any); setActiveView('list'); }} className="cursor-pointer">
                    <SidebarItem
                        icon={<Star size={16} />}
                        label={t('sidebar.favorites')}
                        count={favorites.length}
                        active={activeProvider === ('favorites' as any)}
                        collapsed={isSidebarCollapsed}
                    />
                </div>

                {/* Collections */}
                {!isSidebarCollapsed && (
                    <div className="mt-8 mb-2 px-6 text-[10px] font-bold text-muted/50 tracking-widest uppercase truncate animate-in fade-in duration-300">
                        {t('sidebar.collections')}
                    </div>
                )}
                {/* Separator for collapsed mode */}
                {isSidebarCollapsed && <div className="h-px bg-white/5 mx-4 my-2" />}

                {collections.map(c => (
                    <div
                        key={c.id}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, c.id)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            openContextMenu(e.clientX, e.clientY, c.id, 'collection');
                        }}
                        onClick={() => { setActiveProvider(c.id); setActiveView('list'); }}
                        className="cursor-pointer"
                    >
                        <SidebarItem
                            icon={<Layers size={16} />}
                            label={c.name}
                            count={c.fontIds.length}
                            active={activeProvider === c.id}
                            collapsed={isSidebarCollapsed}
                        />
                    </div>
                ))}

                {isCreating ? (
                    <div className="px-6 py-1 flex items-center space-x-2 animate-in fade-in zoom-in-95 duration-200">
                        <input
                            autoFocus
                            type="text"
                            className="bg-transparent border-b border-accent text-text w-full focus:outline-none text-xs py-1"
                            placeholder={t('sidebar.create_collection_placeholder')}
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmCreate(); if (e.key === 'Escape') handleCancelCreate(); }}
                        />
                        <Check size={14} className="text-accent cursor-pointer hover:scale-110" onClick={handleConfirmCreate} />
                        <X size={14} className="text-red-500 cursor-pointer hover:scale-110" onClick={handleCancelCreate} />
                    </div>
                ) : (
                    <div
                        onClick={handleStartCreate}
                        className={`px-6 py-1 text-muted/50 hover:text-text cursor-pointer flex items-center space-x-3 transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                        title={isSidebarCollapsed ? t('sidebar.new_collection') : undefined}
                    >
                        <Plus size={14} />
                        {!isSidebarCollapsed && <span>{t('sidebar.new_collection')}</span>}
                    </div>
                )}

                {/* Network Providers */}
                {!isSidebarCollapsed && (
                    <div className="mt-8 mb-2 px-6 text-[10px] font-bold text-muted/50 tracking-widest uppercase truncate animate-in fade-in duration-300">
                        {t('sidebar.providers')}
                    </div>
                )}
                {isSidebarCollapsed && <div className="h-px bg-white/5 mx-4 my-2" />}

                <div onClick={() => { setActiveProvider('google'); setActiveView('list'); loadGoogleFonts(); }} className="cursor-pointer">
                    <SidebarItem
                        icon={<Globe size={16} />}
                        label={googleLoading ? "Loading..." : t('sidebar.google')}
                        count={googleCount > 0 ? googleCount : null}
                        active={activeProvider === 'google'}
                        collapsed={isSidebarCollapsed}
                    />
                </div>

                <div onClick={() => { setActiveProvider('local'); setActiveView('list'); if ((localCount === 0 || activeProvider !== 'local') && !loading) loadSystemFonts(); }} className="cursor-pointer">
                    <SidebarItem
                        icon={<Monitor size={16} />}
                        label={loading ? "Loading..." : t('sidebar.local')}
                        count={localCount > 0 ? localCount : null}
                        active={activeProvider === 'local'}
                        collapsed={isSidebarCollapsed}
                    />
                </div>
            </div>

            {error && !isSidebarCollapsed && (
                <div className="p-3 text-red-300 text-xs bg-red-900/30 m-3 rounded border border-red-900/50">
                    {error}
                </div>
            )}

            <div className="p-4">
                <button
                    onClick={openFilePicker}
                    className={`flex items-center justify-center text-muted hover:text-text transition-colors w-full py-2 border border-muted/20 rounded hover:border-muted/50 ${isSidebarCollapsed ? 'gap-0' : 'gap-2'}`}
                    title={isSidebarCollapsed ? t('sidebar.add') : undefined}
                >
                    <Plus size={16} />
                    {!isSidebarCollapsed && <span>{t('sidebar.add')}</span>}
                </button>
            </div>
        </div>
    );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, count: number | null, active?: boolean, collapsed?: boolean }> = ({ icon, label, count, active, collapsed }) => (
    <div
        className={`mx-3 px-3 py-2.5 rounded-md flex items-center cursor-pointer group transition-all duration-200 
        ${active ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:text-text hover:bg-white/5'}
        ${collapsed ? 'justify-center px-2 mx-2' : 'justify-between'}
        `}
        title={collapsed ? label : undefined}
    >
        <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <span className={`transition-colors ${active ? 'text-accent' : 'text-muted group-hover:text-text'}`}>
                {icon}
            </span>
            {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
        </div>
        {!collapsed && count !== null && <span className={`text-xs font-mono transition-opacity ${active ? 'opacity-70' : 'opacity-30 group-hover:opacity-50'}`}>{count}</span>}
    </div>
);
