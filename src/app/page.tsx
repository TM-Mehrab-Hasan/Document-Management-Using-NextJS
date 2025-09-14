'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import DocumentList from '@/components/DocumentList';
import ViewModal from '@/components/ViewModal';
import { Document } from '@/types/document';

export default function Home() {
  const { 
    filteredDocuments, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    deleteDocument 
  } = useDocuments();
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management System
          </h2>
          <p className="text-lg text-gray-600">
            Organize, view, and manage your documents efficiently
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search documents by name, description, or type..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{filteredDocuments.length}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {filteredDocuments.filter(doc => doc.type === 'pdf').length}
            </div>
            <div className="text-sm text-gray-600">PDF Files</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {filteredDocuments.filter(doc => doc.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Images</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {filteredDocuments.filter(doc => doc.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
        </div>

        <DocumentList
          documents={filteredDocuments}
          loading={loading}
          onView={handleViewDocument}
          onDelete={handleDeleteDocument}
        />

        <ViewModal
          document={selectedDocument}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </Layout>
  );
}