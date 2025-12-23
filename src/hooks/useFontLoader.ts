import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { parseFontFile } from '../utils/fontParser';
import type { FontData } from '../types';
import { useTranslation } from 'react-i18next';

export const useFontLoader = () => {
    const addFonts = useStore((state) => state.addFonts);
    const setActiveProvider = useStore((state) => state.setActiveProvider);
    const showToast = useStore((state) => state.showToast);
    const { t } = useTranslation();

    const loadFiles = useCallback(async (files: File[]) => {
        const BATCH_SIZE = 10;
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB Limit (DoS Prevention)

        const successfulFonts: FontData[] = [];
        const errors: any[] = [];
        const oversizedFiles: string[] = [];

        // 1. Pre-filter Oversized Files
        const validFiles = files.filter(f => {
            if (f.size > MAX_FILE_SIZE) {
                oversizedFiles.push(f.name);
                return false;
            }
            return true;
        });

        // Notify about oversized files immediately
        if (oversizedFiles.length > 0) {
            const msg = `File too large (>20MB): ${oversizedFiles.slice(0, 3).join(', ')}${oversizedFiles.length > 3 ? '...' : ''}`;
            showToast(msg, 5000);
        }

        // Process in batches
        for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
            const batch = validFiles.slice(i, i + BATCH_SIZE);
            const promises = batch.map(file => parseFontFile(file));

            const results = await Promise.allSettled(promises); // Wait for this batch

            const failedFiles: { name: string, format: string }[] = [];

            results.forEach((result, idx) => {
                if (result.status === 'fulfilled') {
                    // @ts-ignore
                    successfulFonts.push(result.value);
                } else {
                    const file = batch[idx];
                    const err = result.reason;
                    const fmt = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';

                    if (err instanceof Error && err.message.includes('not supported')) {
                        failedFiles.push({ name: file.name, format: fmt });
                    } else {
                        errors.push(err);
                    }
                }
            });

            // Deduplicate failed files
            const uniqueFailedFiles = Array.from(new Map(failedFiles.map(item => [item.name, item])).values());

            // Handle Format Errors
            if (uniqueFailedFiles.length > 0) {
                if (uniqueFailedFiles.length === 1) {
                    showToast(t('sidebar.format_not_supported', {
                        name: uniqueFailedFiles[0].name,
                        format: uniqueFailedFiles[0].format
                    }), 5000);
                } else {
                    const names = uniqueFailedFiles.map(f => f.name).join(', ');
                    const displayNames = names.length > 300 ? names.substring(0, 300) + '...' : names;
                    const duration = uniqueFailedFiles.length * 5000;
                    showToast(t('sidebar.formats_not_supported', {
                        count: uniqueFailedFiles.length,
                        names: displayNames
                    }), duration);
                }
            }

            if (validFiles.length > 50) await new Promise(r => setTimeout(r, 0));
        }

        if (successfulFonts.length > 0) {
            addFonts(successfulFonts);
            setActiveProvider('added');
        }

        if (errors.length > 0) {
            console.error('Some fonts failed to load', errors);
        }
    }, [addFonts, showToast, t]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files).filter(f =>
            f.name.match(/\.(ttf|otf|woff|woff2|afm|fea|pfa|pfb|sfd|pt3|t42|tfm|vfb)$/i)
        );

        if (files.length > 0) {
            loadFiles(files);
        }
    }, [loadFiles]);

    const openFilePicker = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.ttf,.otf,.woff,.woff2,.afm,.fea,.pfa,.pfb,.sfd,.pt3,.t42,.tfm,.vfb';
        input.style.display = 'none';

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const fileList = Array.from(target.files);
                loadFiles(fileList);
            }
            document.body.removeChild(input);
        };

        document.body.appendChild(input);
        input.click();
    }, [loadFiles]);

    return { loadFiles, handleDrop, openFilePicker };
};
