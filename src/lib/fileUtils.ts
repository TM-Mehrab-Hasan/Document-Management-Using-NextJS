import { DocumentType } from '@/types/document';

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getDocumentType = (filename: string): DocumentType => {
  const extension = getFileExtension(filename);
  
  const typeMap: Record<string, DocumentType> = {
    // Images
    jpg: DocumentType.IMAGE,
    jpeg: DocumentType.IMAGE,
    png: DocumentType.IMAGE,
    gif: DocumentType.IMAGE,
    webp: DocumentType.IMAGE,
    svg: DocumentType.IMAGE,
    bmp: DocumentType.IMAGE,
    
    // Videos
    mp4: DocumentType.VIDEO,
    avi: DocumentType.VIDEO,
    mov: DocumentType.VIDEO,
    wmv: DocumentType.VIDEO,
    flv: DocumentType.VIDEO,
    webm: DocumentType.VIDEO,
    mkv: DocumentType.VIDEO,
    
    // Audio
    mp3: DocumentType.AUDIO,
    wav: DocumentType.AUDIO,
    flac: DocumentType.AUDIO,
    aac: DocumentType.AUDIO,
    ogg: DocumentType.AUDIO,
    wma: DocumentType.AUDIO,
    
    // PDFs
    pdf: DocumentType.PDF,
    
    // Spreadsheets
    xlsx: DocumentType.SPREADSHEET,
    xls: DocumentType.SPREADSHEET,
    csv: DocumentType.SPREADSHEET,
    ods: DocumentType.SPREADSHEET,
    
    // Text
    txt: DocumentType.TEXT,
    doc: DocumentType.TEXT,
    docx: DocumentType.TEXT,
    rtf: DocumentType.TEXT,
    md: DocumentType.TEXT,
  };
  
  return typeMap[extension] || DocumentType.OTHER;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (type: DocumentType): string => {
  const iconMap: Record<DocumentType, string> = {
    [DocumentType.PDF]: '📄',
    [DocumentType.IMAGE]: '🖼️',
    [DocumentType.VIDEO]: '🎥',
    [DocumentType.AUDIO]: '🎵',
    [DocumentType.SPREADSHEET]: '📊',
    [DocumentType.TEXT]: '📝',
    [DocumentType.OTHER]: '📁',
  };
  
  return iconMap[type] || '📁';
};

export const isViewableInBrowser = (type: DocumentType): boolean => {
  return [
    DocumentType.PDF,
    DocumentType.IMAGE,
    DocumentType.VIDEO,
    DocumentType.AUDIO,
    DocumentType.TEXT
  ].includes(type);
};

export const generateThumbnail = (type: DocumentType): string => {
  // In a real application, this would generate actual thumbnails
  // For now, we'll return placeholder images based on document type
  const placeholders: Record<DocumentType, string> = {
    [DocumentType.PDF]: '/api/placeholder/150/200?text=PDF',
    [DocumentType.IMAGE]: '/api/placeholder/150/200?text=Image',
    [DocumentType.VIDEO]: '/api/placeholder/150/200?text=Video',
    [DocumentType.AUDIO]: '/api/placeholder/150/200?text=Audio',
    [DocumentType.SPREADSHEET]: '/api/placeholder/150/200?text=Excel',
    [DocumentType.TEXT]: '/api/placeholder/150/200?text=Text',
    [DocumentType.OTHER]: '/api/placeholder/150/200?text=File',
  };
  
  return placeholders[type] || placeholders[DocumentType.OTHER];
};