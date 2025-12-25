import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { Layers, Trash2 } from 'lucide-react';

export const ContextMenu: React.FC = () => {
    const { t } = useTranslation();
    const { contextMenu, closeContextMenu, collections, addToCollection, deleteCollection, showToast } = useStore();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeContextMenu();
            }
        };

        if (contextMenu.isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu.isOpen, closeContextMenu]);

    if (!contextMenu.isOpen || !contextMenu.targetId) return null;

    const handleAddToCollection = (collectionId: string, collectionName: string) => {
        addToCollection(collectionId, contextMenu.targetId!);
        showToast(`${t('sidebar.added_to')} ${collectionName}`);
        closeContextMenu();
    };

    const handleDeleteCollection = () => {
        deleteCollection(contextMenu.targetId!);
        showToast(t('sidebar.collection_deleted'));
        closeContextMenu();
    };

    if (contextMenu.type === 'collection') {
        return (
            <div
                ref={menuRef}
                className="fixed bg-surface border border-muted/20 shadow-xl rounded py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                style={{ top: contextMenu.y, left: contextMenu.x }}
            >
                <div
                    onClick={handleDeleteCollection}
                    className="px-3 py-2 text-red-400 hover:bg-white/10 cursor-pointer flex items-center space-x-2 transition-colors"
                >
                    <Trash2 size={14} />
                    <span>{t('sidebar.delete_collection')}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={menuRef}
            className="fixed bg-surface border border-muted/20 shadow-xl rounded py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
        >
            <div className="px-3 py-1 text-muted text-xs font-bold uppercase tracking-wider border-b border-white/5 mb-1">
                {t('sidebar.add_to_collection')}
            </div>

            {collections.length === 0 ? (
                <div className="px-3 py-2 text-muted italic text-xs">
                    {t('sidebar.no_collections')}
                </div>
            ) : (
                collections.map(c => (
                    <div
                        key={c.id}
                        onClick={() => handleAddToCollection(c.id, c.name)}
                        className="px-3 py-2 hover:bg-white/10 cursor-pointer flex items-center space-x-2 transition-colors"
                    >
                        <Layers size={14} className="text-muted" />
                        <span>{c.name}</span>
                    </div>
                ))
            )}
        </div>
    );
};
