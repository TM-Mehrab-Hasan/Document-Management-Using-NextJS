'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { getDocumentType } from '@/lib/fileUtils';
import { DocumentType } from '@/types/document';

interface FileUploadProps {
  onClose?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const { addDocument } = useDocuments();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    const allowedTypes = [
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      
      // Validate file size
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported for ${file.name}.`);
        continue;
      }

      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate file upload with progress
      const uploadPromise = new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            resolve();
          }
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }, 200);
      });

      await uploadPromise;

      // Create document object
      const documentType = getDocumentType(file.name);
      const fileUrl = URL.createObjectURL(file); // In a real app, this would be the uploaded file URL

      const newDocument = {
        name: file.name,
        description: `Uploaded file: ${file.name}`,
        type: documentType,
        fileUrl: fileUrl,
        thumbnailUrl: fileUrl, // Use the same URL as thumbnail for now
        size: file.size,
      };

      addDocument(newDocument);

      // Remove from progress tracking
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    }

    setUploading(false);
    if (onClose) onClose();
  }, [addDocument, onClose]);

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Files</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.wmv,.mp3,.wav,.m4a,.ogg,.xlsx,.xls,.docx,.doc,.txt"
          />

          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop files here' : 'Drag files here or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Support for PDF, images, videos, audio, documents, and spreadsheets
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 50MB
              </p>
            </div>

            <button
              onClick={onButtonClick}
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
          </div>
        </div>

        {/* Upload Progress */}
        {Object.entries(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Upload Progress</h3>
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{fileId.split('-')[0]}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;