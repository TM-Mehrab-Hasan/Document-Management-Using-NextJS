'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { User, DocumentPermissions } from '@/types/document';

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useDocuments();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [users] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'editor' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@company.com', role: 'viewer' },
    { id: '4', name: 'Alice Brown', email: 'alice.brown@company.com', role: 'editor' },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolePermissions = (role: 'admin' | 'editor' | 'viewer'): DocumentPermissions => {
    switch (role) {
      case 'admin':
        return { canView: true, canEdit: true, canDelete: true, canShare: true };
      case 'editor':
        return { canView: true, canEdit: true, canDelete: false, canShare: true };
      case 'viewer':
        return { canView: true, canEdit: false, canDelete: false, canShare: false };
    }
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    // In a real app, this would make an API call
    console.log(`Changing role for user ${userId} to ${newRole}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">User Management & Permissions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current User Info */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Current User</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-sm text-gray-600">{currentUser?.email}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(currentUser?.role || 'viewer')}`}>
                {currentUser?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Role Permissions Matrix */}
          <div className="mb-8">
            <h3 className="font-medium text-gray-900 mb-4">Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View Documents
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edit Documents
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delete Documents
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Share Documents
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(['admin', 'editor', 'viewer'] as const).map((role) => {
                    const permissions = getRolePermissions(role);
                    return (
                      <tr key={role}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}>
                            {role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {permissions.canView ? '✅' : '❌'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {permissions.canEdit ? '✅' : '❌'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {permissions.canDelete ? '✅' : '❌'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {permissions.canShare ? '✅' : '❌'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* User List */}
          <div className="mb-8">
            <h3 className="font-medium text-gray-900 mb-4">System Users</h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                    
                    {currentUser?.role === 'admin' && (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'editor' | 'viewer')}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Simulator */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-4">Role Simulator</h3>
            <p className="text-sm text-yellow-800 mb-4">
              Test different user roles to see how permissions affect the interface:
            </p>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-yellow-900">Simulate Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                className="px-3 py-2 border border-yellow-300 rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              
              <button
                onClick={() => {
                  const simulatedUser: User = {
                    id: 'simulated',
                    name: `Test ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
                    email: `test.${selectedRole}@company.com`,
                    role: selectedRole
                  };
                  setCurrentUser(simulatedUser);
                  onClose();
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
              >
                Apply Role
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;