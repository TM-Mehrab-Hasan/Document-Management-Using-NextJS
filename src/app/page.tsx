'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import DocumentList from '@/components/DocumentList';
import ViewModal from '@/components/ViewModal';
import SearchBar from '@/components/SearchBar';
import FileUpload from '@/components/FileUpload';
import AdvancedFilter from '@/components/AdvancedFilter';
import FolderSidebar from '@/components/FolderSidebar';
import UserManagement from '@/components/UserManagement';
import AnalyticsModal from '@/components/AnalyticsModal';
import { useDocuments } from '@/context/DocumentContext';
import { Document } from '@/types/document';

export default function Home() {
  const { 
    documents, 
    filteredDocuments, 
    loading, 
    searchTerm, 
    setSearchTerm,
    deleteDocument,
    selectedFolder,
    folders,
    viewMode,
    setViewMode,
    applyFilters
  } = useDocuments();
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  const getCurrentFolderName = () => {
    if (!selectedFolder) return 'All Documents';
    const folder = folders.find(f => f.id === selectedFolder);
    return folder ? folder.name : 'Unknown Folder';
  };

  const getDocumentStats = () => {
    const stats = {
      total: documents.length,
      filtered: filteredDocuments.length,
      byType: {} as Record<string, number>,
      totalSize: 0,
    };

    filteredDocuments.forEach(doc => {
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      stats.totalSize += doc.size;
    });

    return stats;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const stats = getDocumentStats();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Management System
            </h1>
            <p className="text-gray-600">
              Organize, view, and manage your documents efficiently
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.filtered}</p>
                  {stats.filtered !== stats.total && (
                    <p className="text-xs text-gray-500">of {stats.total} total</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Folder</p>
                  <p className="text-lg font-bold text-gray-900 truncate">{getCurrentFolderName()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Size</p>
                  <p className="text-lg font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Folders</p>
                  <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Search and Filters */}
            <div className="flex-1 max-w-md">
              <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                placeholder="Search documents, tags, or content..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-l-lg ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-r-lg ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ☰
                </button>
              </div>

              <button
                onClick={() => setShowUserManagement(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                👥 Users
              </button>

              <button
                onClick={() => setShowFolders(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📁 Folders
              </button>

              <button
                onClick={() => setShowAnalytics(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📊 Analytics
              </button>

              <button
                onClick={() => setShowFilters(true)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔍 Filters
              </button>

              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📤 Upload Files
              </button>
            </div>
          </div>

          {/* File Type Filter Chips */}
          {Object.keys(stats.byType).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-600">Quick filters:</span>
              {Object.entries(stats.byType).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => applyFilters({ type, dateRange: 'all', sizeRange: 'all' })}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </button>
              ))}
            </div>
          )}

          {/* Document List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {getCurrentFolderName()}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({stats.filtered} {stats.filtered === 1 ? 'document' : 'documents'})
                </span>
              </h2>
            </div>
            
            <DocumentList
              documents={filteredDocuments}
              loading={loading}
              onView={handleViewDocument}
              onDelete={handleDeleteDocument}
              viewMode={viewMode}
            />
          </div>

          {/* Empty State */}
          {!loading && filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria or clearing filters'
                  : 'Get started by uploading your first document'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Your First Document
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ViewModal
          document={selectedDocument}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {showUpload && (
          <FileUpload onClose={() => setShowUpload(false)} />
        )}

        {showFilters && (
          <AdvancedFilter
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onApplyFilters={applyFilters}
          />
        )}

        <FolderSidebar
          isOpen={showFolders}
          onClose={() => setShowFolders(false)}
        />

        <UserManagement
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
        />

        <AnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </div>
    </Layout>
  );
}