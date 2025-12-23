
export interface FontMetadata {
    family: string;
    subfamily: string; // e.g., Regular, Bold
    fullName: string;
    postscriptName: string;
    version?: string;
    format: string; // 'otf', 'ttf', etc.
    glyphCount?: number;
    supportedChars?: number[]; // List of unicode values supported by the font
    author?: string;
    copyright?: string;
    license?: string;
}

export interface FontData {
    id: string;
    file: File; // The raw file
    url: string; // Blob URL for CSS @font-face
    metadata: FontMetadata;
    tags: string[];
    hash: string; // Content hash for deduplication
}

export interface Collection {
    id: string;
    name: string;
    fontIds: string[];
}
