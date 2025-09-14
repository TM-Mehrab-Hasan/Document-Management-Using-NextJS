export enum DocumentType {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  SPREADSHEET = 'spreadsheet',
  TEXT = 'text',
  OTHER = 'other'
}

export interface Document {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  fileUrl: string;
  thumbnailUrl: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  tags?: string[];
  version?: number;
  permissions?: DocumentPermissions;
  sharedWith?: string[];
  lastAccessedAt?: Date;
  downloadCount?: number;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface DocumentPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  size: number;
  createdAt: Date;
  createdBy: string;
  changeLog?: string;
}

export interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredDocuments: Document[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setSearchTerm: (term: string) => void;
  searchDocuments: (term: string) => Document[];
}

export interface ViewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder?: string;
}

export interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
}