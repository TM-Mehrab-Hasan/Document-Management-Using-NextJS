'use client';

import React from 'react';
import { Document } from '@/types/document';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  loading = false, 
  onView, 
  onDelete,
  viewMode = 'grid'
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeColor = (type: string): string => {
    const colors = {
      pdf: 'bg-red-100 text-red-800',
      image: 'bg-green-100 text-green-800',
      video: 'bg-blue-100 text-blue-800',
      audio: 'bg-yellow-100 text-yellow-800',
      spreadsheet: 'bg-purple-100 text-purple-800',
      text: 'bg-gray-100 text-gray-800',
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6" 
        : "space-y-4 p-6"
      }>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            {viewMode === 'grid' ? (
              <>
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your search terms or upload some documents to get started.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="divide-y divide-gray-200">
        {documents.map((document) => (
          <div key={document.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Document Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={document.thumbnailUrl} 
                    alt={document.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {document.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {document.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                      {document.type.toUpperCase()}
                    </span>
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {document.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{document.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="hidden md:flex flex-col items-end space-y-1 text-sm text-gray-500">
                  <span>{formatFileSize(document.size)}</span>
                  <span>{formatDate(document.updatedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onView(document)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View document"
                >
                  👁️
                </button>
                <button
                  onClick={() => onDelete(document.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete document"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DocumentList;