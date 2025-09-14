export interface Document {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  fileUrl: string;
  thumbnailUrl?: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  SPREADSHEET = 'spreadsheet',
  TEXT = 'text',
  OTHER = 'other'
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