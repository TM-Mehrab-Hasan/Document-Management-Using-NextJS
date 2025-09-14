'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, DocumentContextType, DocumentType, Folder, User } from '@/types/document';
import { getDocumentType, generateThumbnail } from '@/lib/fileUtils';

interface ExtendedDocumentContextType extends DocumentContextType {
  folders: Folder[];
  currentUser: User | null;
  selectedFolder: string | null;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  filters: {
    type: DocumentType | 'all';
    dateRange: string;
    sizeRange: string;
  };
  
  // Folder operations
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setSelectedFolder: (folderId: string | null) => void;
  
  // View and filter operations
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: 'name' | 'date' | 'size' | 'type') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  applyFilters: (filters: any) => void;
  
  // User operations
  setCurrentUser: (user: User | null) => void;
}

const DocumentContext = createContext<ExtendedDocumentContextType | undefined>(undefined);

// Mock folders
const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Financial Reports',
    description: 'Annual and quarterly financial documents',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Media Assets',
    description: 'Images, videos, and multimedia content',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Project Documentation',
    description: 'Project plans and documentation',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    color: '#F59E0B'
  }
];

// Mock current user
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin'
};

// Mock data for demonstration - Updated with folder assignments
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Annual Report 2025.pdf',
    description: 'Company annual financial report for the year 2025 with detailed analysis and projections.',
    type: DocumentType.PDF,
    fileUrl: '/files/annual-report-2025.pdf',
    thumbnailUrl: generateThumbnail(DocumentType.PDF),
    size: 2485760,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    folderId: '1',
    tags: ['finance', 'annual', 'report'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    description: 'Official team photograph taken during the annual company retreat.',
    type: DocumentType.IMAGE,
    fileUrl: '/files/team-photo.jpg',
    thumbnailUrl: generateThumbnail(DocumentType.IMAGE),
    size: 1048576,
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-20'),
    folderId: '2',
    tags: ['team', 'photo', 'company'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '3',
    name: 'Presentation Video.mp4',
    description: 'CEO presentation video from the quarterly meeting discussing company strategy.',
    type: DocumentType.VIDEO,
    fileUrl: '/files/presentation-video.mp4',
    thumbnailUrl: generateThumbnail(DocumentType.VIDEO),
    size: 15728640,
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-10'),
    folderId: '2',
    tags: ['presentation', 'CEO', 'strategy'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '4',
    name: 'Sales Data.xlsx',
    description: 'Comprehensive sales data spreadsheet with quarterly breakdowns and analysis.',
    type: DocumentType.SPREADSHEET,
    fileUrl: '/files/sales-data.xlsx',
    thumbnailUrl: generateThumbnail(DocumentType.SPREADSHEET),
    size: 524288,
    createdAt: new Date('2025-03-25'),
    updatedAt: new Date('2025-03-28'),
    folderId: '1',
    tags: ['sales', 'data', 'quarterly'],
    version: 2,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '5',
    name: 'Meeting Recording.mp3',
    description: 'Audio recording of the board meeting held on March 15th, 2025.',
    type: DocumentType.AUDIO,
    fileUrl: '/files/meeting-recording.mp3',
    thumbnailUrl: generateThumbnail(DocumentType.AUDIO),
    size: 8388608,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-15'),
    folderId: '3',
    tags: ['meeting', 'board', 'recording'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '6',
    name: 'Project Proposal.docx',
    description: 'Detailed project proposal document for the new product development initiative.',
    type: DocumentType.TEXT,
    fileUrl: '/files/project-proposal.docx',
    thumbnailUrl: generateThumbnail(DocumentType.TEXT),
    size: 786432,
    createdAt: new Date('2025-04-02'),
    updatedAt: new Date('2025-04-05'),
    folderId: '3',
    tags: ['project', 'proposal', 'product'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '7',
    name: 'Company Logo.png',
    description: 'High-resolution company logo in PNG format for marketing materials.',
    type: DocumentType.IMAGE,
    fileUrl: '/files/company-logo.png',
    thumbnailUrl: generateThumbnail(DocumentType.IMAGE),
    size: 204800,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    folderId: '2',
    tags: ['logo', 'branding', 'marketing'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '8',
    name: 'Training Manual.pdf',
    description: 'Employee training manual covering company policies and procedures.',
    type: DocumentType.PDF,
    fileUrl: '/files/training-manual.pdf',
    thumbnailUrl: generateThumbnail(DocumentType.PDF),
    size: 3145728,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
    folderId: '3',
    tags: ['training', 'manual', 'policies'],
    version: 1,
    downloadCount: 0,
    permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
  },
];

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    type: 'all' as DocumentType | 'all',
    dateRange: 'all',
    sizeRange: 'all',
  });

  // Update filtered documents when search term, documents, or filters change
  useEffect(() => {
    let filtered = documents;

    // Apply folder filter
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folderId === selectedFolder);
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }

    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(doc => doc.updatedAt >= filterDate);
    }

    // Apply size filter
    if (filters.sizeRange !== 'all') {
      filtered = filtered.filter(doc => {
        const sizeMB = doc.size / (1024 * 1024);
        switch (filters.sizeRange) {
          case 'small': return sizeMB < 1;
          case 'medium': return sizeMB >= 1 && sizeMB <= 10;
          case 'large': return sizeMB > 10;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [searchTerm, documents, selectedFolder, filters, sortBy, sortOrder]);

  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newDocument: Document = {
        ...documentData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        type: documentData.type || getDocumentType(documentData.name),
        thumbnailUrl: documentData.thumbnailUrl || generateThumbnail(documentData.type || getDocumentType(documentData.name)),
        version: 1,
        downloadCount: 0,
        permissions: { canView: true, canEdit: true, canDelete: true, canShare: true }
      };
      
      setDocuments(prev => [...prev, newDocument]);
      setError(null);
    } catch (err) {
      setError('Failed to add document');
      console.error('Error adding document:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    try {
      setLoading(true);
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === id
            ? { ...doc, ...updates, updatedAt: new Date() }
            : doc
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update document');
      console.error('Error updating document:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = (id: string) => {
    try {
      setLoading(true);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchDocuments = (term: string): Document[] => {
    if (term.trim() === '') return documents;
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(term.toLowerCase()) ||
      doc.description.toLowerCase().includes(term.toLowerCase()) ||
      doc.type.toLowerCase().includes(term.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
    );
  };

  // Folder operations
  const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id
          ? { ...folder, ...updates, updatedAt: new Date() }
          : folder
      )
    );
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // Move documents to root
    setDocuments(prev => 
      prev.map(doc => 
        doc.folderId === id 
          ? { ...doc, folderId: undefined }
          : doc
      )
    );
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const contextValue: ExtendedDocumentContextType = {
    documents,
    folders,
    currentUser,
    selectedFolder,
    viewMode,
    sortBy,
    sortOrder,
    filters,
    loading,
    error,
    searchTerm,
    filteredDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    setSearchTerm,
    searchDocuments,
    addFolder,
    updateFolder,
    deleteFolder,
    setSelectedFolder,
    setViewMode,
    setSortBy,
    setSortOrder,
    applyFilters,
    setCurrentUser,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): ExtendedDocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};