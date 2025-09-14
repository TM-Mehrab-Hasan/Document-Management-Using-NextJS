'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { Folder } from '@/types/document';

interface FolderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FolderSidebar: React.FC<FolderSidebarProps> = ({ isOpen, onClose }) => {
  const { 
    folders, 
    selectedFolder, 
    setSelectedFolder, 
    addFolder, 
    updateFolder, 
    deleteFolder,
    documents 
  } = useDocuments();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  const folderColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const getDocumentCount = (folderId: string): number => {
    return documents.filter(doc => doc.folderId === folderId).length;
  };

  const getRootDocumentCount = (): number => {
    return documents.filter(doc => !doc.folderId).length;
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const randomColor = folderColors[Math.floor(Math.random() * folderColors.length)];
      addFolder({
        name: newFolderName,
        description: newFolderDescription,
        color: randomColor,
      });
      setNewFolderName('');
      setNewFolderDescription('');
      setIsCreating(false);
    }
  };

  const handleUpdateFolder = (folderId: string) => {
    if (newFolderName.trim()) {
      updateFolder(folderId, {
        name: newFolderName,
        description: newFolderDescription,
      });
      setEditingFolder(null);
      setNewFolderName('');
      setNewFolderDescription('');
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Are you sure? Documents in this folder will be moved to the root.')) {
      deleteFolder(folderId);
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
    }
  };

  const handleEditStart = (folder: Folder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
    setNewFolderDescription(folder.description || '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
      <div className="bg-white w-80 h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Folders</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        {/* All Documents (Root) */}
        <div className="p-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedFolder === null 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center mr-3">
                📁
              </div>
              <div className="text-left">
                <div className="font-medium">All Documents</div>
                <div className="text-sm text-gray-500">{getRootDocumentCount()} files</div>
              </div>
            </div>
          </button>
        </div>

        {/* Folders List */}
        <div className="px-2">
          {folders.map((folder) => (
            <div key={folder.id} className="mb-2">
              {editingFolder === folder.id ? (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="w-full p-2 border rounded text-sm"
                    autoFocus
                  />
                  <input
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full p-2 border rounded text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateFolder(folder.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingFolder(null);
                        setNewFolderName('');
                        setNewFolderDescription('');
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedFolder === folder.id 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center mr-3"
                      style={{ backgroundColor: folder.color }}
                    >
                      📁
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{folder.name}</div>
                      <div className="text-sm text-gray-500">
                        {getDocumentCount(folder.id)} files
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(folder);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Create New Folder */}
        <div className="p-2 border-t mt-4">
          {isCreating ? (
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full p-2 border rounded text-sm"
                autoFocus
              />
              <input
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full p-2 border rounded text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewFolderName('');
                    setNewFolderDescription('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            >
              <span className="mr-2">+</span>
              Create New Folder
            </button>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      <div 
        className="flex-1 bg-transparent" 
        onClick={onClose}
      />
    </div>
  );
};

export default FolderSidebar;