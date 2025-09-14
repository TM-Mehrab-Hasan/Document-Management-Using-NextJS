'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, DocumentContextType, DocumentType } from '@/types/document';
import { getDocumentType, generateThumbnail } from '@/lib/fileUtils';

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Mock data for demonstration
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Annual Report 2024.pdf',
    description: 'Company annual financial report for the year 2024 with detailed analysis and projections.',
    type: DocumentType.PDF,
    fileUrl: '/files/annual-report-2024.pdf',
    thumbnailUrl: generateThumbnail(DocumentType.PDF),
    size: 2485760,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    description: 'Official team photograph taken during the annual company retreat.',
    type: DocumentType.IMAGE,
    fileUrl: '/files/team-photo.jpg',
    thumbnailUrl: generateThumbnail(DocumentType.IMAGE),
    size: 1048576,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Presentation Video.mp4',
    description: 'CEO presentation video from the quarterly meeting discussing company strategy.',
    type: DocumentType.VIDEO,
    fileUrl: '/files/presentation-video.mp4',
    thumbnailUrl: generateThumbnail(DocumentType.VIDEO),
    size: 15728640,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Sales Data.xlsx',
    description: 'Comprehensive sales data spreadsheet with quarterly breakdowns and analysis.',
    type: DocumentType.SPREADSHEET,
    fileUrl: '/files/sales-data.xlsx',
    thumbnailUrl: generateThumbnail(DocumentType.SPREADSHEET),
    size: 524288,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-28'),
  },
  {
    id: '5',
    name: 'Meeting Recording.mp3',
    description: 'Audio recording of the board meeting held on March 15th, 2024.',
    type: DocumentType.AUDIO,
    fileUrl: '/files/meeting-recording.mp3',
    thumbnailUrl: generateThumbnail(DocumentType.AUDIO),
    size: 8388608,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '6',
    name: 'Project Proposal.docx',
    description: 'Detailed project proposal document for the new product development initiative.',
    type: DocumentType.TEXT,
    fileUrl: '/files/project-proposal.docx',
    thumbnailUrl: generateThumbnail(DocumentType.TEXT),
    size: 786432,
    createdAt: new Date('2024-04-02'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: '7',
    name: 'Company Logo.png',
    description: 'High-resolution company logo in PNG format for marketing materials.',
    type: DocumentType.IMAGE,
    fileUrl: '/files/company-logo.png',
    thumbnailUrl: generateThumbnail(DocumentType.IMAGE),
    size: 204800,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '8',
    name: 'Training Manual.pdf',
    description: 'Employee training manual covering company policies and procedures.',
    type: DocumentType.PDF,
    fileUrl: '/files/training-manual.pdf',
    thumbnailUrl: generateThumbnail(DocumentType.PDF),
    size: 3145728,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
];

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);

  // Update filtered documents when search term or documents change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, documents]);

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
      doc.type.toLowerCase().includes(term.toLowerCase())
    );
  };

  const contextValue: DocumentContextType = {
    documents,
    loading,
    error,
    searchTerm,
    filteredDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    setSearchTerm,
    searchDocuments,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};