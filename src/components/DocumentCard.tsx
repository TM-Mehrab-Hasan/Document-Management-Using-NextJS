'use client';

import React from 'react';
import { Document } from '@/types/document';
import { formatFileSize, getFileIcon } from '@/lib/fileUtils';
import { useDocuments } from '@/context/DocumentContext';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView, onDelete }) => {
  const { currentUser } = useDocuments();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const canDelete = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || 
           (document.permissions?.canDelete ?? false);
  };

  const canView = () => {
    if (!currentUser) return false;
    return document.permissions?.canView ?? true;
  };

  const canShare = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || 
           currentUser.role === 'editor' || 
           (document.permissions?.canShare ?? false);
  };

  if (!canView()) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-4xl">🔒</div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-500">Restricted Access</h3>
          <p className="text-sm text-gray-400">You don't have permission to view this document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden hover-lift animate-fade-in">
      {/* Thumbnail/Icon Section */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
        <div className="text-6xl">
          {getFileIcon(document.type)}
        </div>
        
        {/* Permission indicators */}
        <div className="absolute top-2 right-2 flex space-x-1">
          {document.version && document.version > 1 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              v{document.version}
            </span>
          )}
          {document.sharedWith && document.sharedWith.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Shared
            </span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate" title={document.name}>
            {document.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full uppercase">
              {document.type}
            </span>
            {document.tags && document.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={document.description}>
          {document.description}
        </p>
        
        {/* File Info */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{formatFileSize(document.size)}</span>
          </div>
          <div className="flex justify-between">
            <span>Modified:</span>
            <span>{formatDate(document.updatedAt)}</span>
          </div>
          {document.downloadCount !== undefined && (
            <div className="flex justify-between">
              <span>Downloads:</span>
              <span>{document.downloadCount}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(document)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
          
          {canShare() && (
            <button
              onClick={() => {/* Implement share functionality */}}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              title="Share document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          )}
          
          {canDelete() && (
            <button
              onClick={() => onDelete(document.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Delete document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Permission indicator */}
        <div className="mt-2 text-xs text-gray-400">
          Role: {currentUser?.role} | 
          {canDelete() ? ' Can delete' : ' View only'}
          {canShare() ? ' | Can share' : ''}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;