import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "drop_here": "Drop fonts here",
                    "sidebar": {
                        "all": "All",
                        "recent": "Recent",
                        "favorites": "Favorites",
                        "collections": "Collections",
                        "providers": "Providers",
                        "google": "Google",
                        "local": "Local",
                        "local_api_error": "Local Font Access API not supported. Please use Chrome/Edge or upload files manually.",
                        "add": "Add",
                        "create_collection_placeholder": "Collection name...",
                        "add_to_collection": "Add to collection",
                        "loaded": "Loaded",
                        "clipboard_copied": "Copied to clipboard",
                        "no_collections": "No collections created",
                        "empty_state": "No fonts loaded. Add some fonts to get started!",
                        "family_not_found": "Family not found",
                        "new_collection": "New collection",
                        "welcome_title": "Welcome to FontDeck",
                        "welcome_subtitle": "",
                        "welcome_message": "Drag and drop fonts here or choose a provider from the sidebar to get started.",
                        "no_search_results": "No fonts found",
                        "no_search_message": "Try adjusting your search or filters",
                        "delete_collection": "Delete Collection",
                        "collection_deleted": "Collection deleted",
                        "added_to": "Added to",
                        "play_game": "Play Font Memory",
                        "match_typefaces": "Match the Typefaces",
                        "cancel": "Cancel",
                        "format_not_supported": "File '{{name}}' ({{format}}) is not supported for preview",
                        "formats_not_supported": "{{count}} files not supported: {{names}}"
                    },
                    "topbar": {
                        "search": "Search fonts...",
                        "preview_placeholder": "Type something...",
                        "size": "Size"
                    },
                    "fontrow": {
                        "view_family": "View family",
                        "activate": "Activate"
                    },
                    "details": {
                        "styles": "Styles",
                        "waterfall": "Waterfall",
                        "glyphs": "Glyphs",
                        "details_tab": "Details",
                        "styles_count": "styles",
                        "waterfall_sample": "The quick brown fox jumps over the lazy dog.",
                        "click_to_copy": "Click to copy",
                        "labels": {
                            "family": "Font Family",
                            "subfamily": "Subfamily",
                            "fullname": "Full Name",
                            "postscript": "PostScript Name",
                            "format": "Format",
                            "version": "Version",
                            "glyphs_count": "Glyphs",
                            "author": "Author",
                            "copyright": "Copyright",
                            "license": "License"
                        },
                        "copy_details": "Copy Details",
                        "copied_to_clipboard": "Details copied to clipboard",
                        "glyph_disclaimer": "* Showing default character set (Latin + Hebrew). Accurate glyph listing not available for this format."
                    },
                    "consent": {
                        "message": "Do you want to store your fonts in the browser for next time?",
                        "accept": "Accept",
                        "reject": "Reject"
                    },
                    "info": {
                        "title": "About FontDeck",
                        "changelog": "Changelog",
                        "credits": "Credits",
                        "support": "Support Project",
                        "buy_coffee": "Buy @hadashnova a Coffee",
                        "developed_by": "Developed by",
                        "close": "Close",
                        "excellent": "Excellent!",
                        "typography_eye": "You have an eye for typography.",
                        "back_to_lobby": "Back to Lobby"
                    }
                }
            },
            es: {
                translation: {
                    "drop_here": "Suelta las fuentes aquí",
                    "sidebar": {
                        "all": "Todos",
                        "recent": "Recientes",
                        "favorites": "Favoritos",
                        "collections": "Colecciones",
                        "providers": "Proveedores",
                        "google": "Google",
                        "local": "Local",
                        "local_api_error": "API de Acceso a Fuentes Locales no soportada. Usa Chrome/Edge o sube archivos manualmente.",
                        "add": "Agregar",
                        "loaded": "Cargadas",
                        "clipboard_copied": "Copiado al portapapeles",
                        "create_collection_placeholder": "Nombre de colección...",
                        "add_to_collection": "Añadir a colección",
                        "no_collections": "Sin colecciones",
                        "empty_state": "No hay fuentes cargadas. ¡Agrega algunas para empezar!",
                        "family_not_found": "Familia no encontrada",
                        "new_collection": "Nueva colección",
                        "welcome_title": "Bienvenido a FontDeck",
                        "welcome_subtitle": "",
                        "welcome_message": "Arrastra y suelta fuentes aquí o elige un proveedor de la barra lateral para comenzar.",
                        "no_search_results": "No se encontraron fuentes",
                        "no_search_message": "Intenta ajustar tu búsqueda o filtros",
                        "delete_collection": "Eliminar Colección",
                        "collection_deleted": "Colección eliminada",
                        "added_to": "Añadido a",
                        "play_game": "Jugar Memoria de Fuentes",
                        "match_typefaces": "Empareja las Tipografías",
                        "cancel": "Cancelar",
                        "format_not_supported": "El archivo '{{name}}' ({{format}}) no es compatible",
                        "formats_not_supported": "{{count}} archivos no compatibles: {{names}}"
                    },
                    "topbar": {
                        "search": "Buscar fuentes...",
                        "preview_placeholder": "Escribe algo...",
                        "size": "Tamaño"
                    },
                    "fontrow": {
                        "view_family": "Ver familia",
                        "activate": "Activar"
                    },
                    "details": {
                        "styles": "Estilos",
                        "waterfall": "Cascada",
                        "glyphs": "Glifos",
                        "details_tab": "Detalles",
                        "styles_count": "estilos",
                        "waterfall_sample": "El veloz murciélago hindú comía feliz cardillo.",
                        "click_to_copy": "Clic para copiar",
                        "labels": {
                            "family": "Familia",
                            "subfamily": "Subfamilia",
                            "fullname": "Nombre Completo",
                            "postscript": "Nombre PostScript",
                            "format": "Formato",
                            "version": "Versión",
                            "glyphs_count": "Glifos",
                            "author": "Autor",
                            "copyright": "Copyright",
                            "license": "Licencia"
                        },
                        "copy_details": "Copiar detalles",
                        "copied_to_clipboard": "Detalles copiados al portapapeles",
                        "glyph_disclaimer": "* Mostrando conjunto de caracteres predeterminado (Latín + Hebreo). Listado exacto de glifos no disponible para este formato."
                    },
                    "consent": {
                        "message": "¿Quieres guardar tus fuentes en el navegador para la próxima vez?",
                        "accept": "Aceptar",
                        "reject": "Rechazar"
                    },
                    "info": {
                        "title": "Acerca de FontDeck",
                        "changelog": "Registro de Cambios",
                        "credits": "Créditos",
                        "support": "Apoyar Proyecto",
                        "buy_coffee": "Invítame un café a @hadashnova",
                        "developed_by": "Desarrollado por",
                        "close": "Cerrar",
                        "excellent": "¡Excelente!",
                        "typography_eye": "Tienes buen ojo para la tipografía.",
                        "back_to_lobby": "Volver al Lobby"
                    }
                }
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
