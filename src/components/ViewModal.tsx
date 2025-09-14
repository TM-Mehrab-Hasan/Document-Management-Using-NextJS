'use client';

import React from 'react';
import { ViewModalProps, DocumentType } from '@/types/document';
import { formatFileSize } from '@/lib/fileUtils';

const ViewModal: React.FC<ViewModalProps> = ({ document, isOpen, onClose }) => {
  if (!isOpen || !document) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderDocumentViewer = () => {
    switch (document.type) {
      case DocumentType.IMAGE:
        return (
          <div className="flex justify-center bg-gray-100 rounded-lg p-4">
            <img
              src={document.fileUrl}
              alt={document.name}
              className="max-w-full max-h-96 object-contain rounded"
            />
          </div>
        );
      
      case DocumentType.VIDEO:
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <video
              controls
              className="w-full max-h-96 rounded"
              preload="metadata"
            >
              <source src={document.fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case DocumentType.AUDIO:
        return (
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-4">🎵</div>
              <audio controls className="w-full max-w-md">
                <source src={document.fileUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        );
      
      case DocumentType.PDF:
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 mb-4">PDF Preview</p>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
              </a>
            </div>
          </div>
        );
      
      case DocumentType.SPREADSHEET:
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600 mb-4">Spreadsheet Preview</p>
              <div className="space-y-2">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mr-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-600 mb-4">File cannot be previewed</p>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download File
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate" title={document.name}>
              {document.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{document.type.toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            {renderDocumentViewer()}
          </div>

          {/* Document Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{document.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File Size</label>
                <p className="mt-1 text-sm text-gray-900">{formatFileSize(document.size)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(document.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;