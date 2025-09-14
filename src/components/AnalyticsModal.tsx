'use client';

import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { Document, DocumentType } from '@/types/document';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  totalDocuments: number;
  totalSize: number;
  typeDistribution: Record<string, number>;
  folderDistribution: Record<string, number>;
  uploadTrend: { month: string; count: number; size: number }[];
  topDocuments: { document: Document; score: number }[];
  storageByType: Record<string, number>;
  recentActivity: { type: string; document: string; date: Date }[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { documents, folders } = useDocuments();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (isOpen) {
      generateAnalytics();
    }
  }, [isOpen, documents, selectedTimeRange]);

  const generateAnalytics = () => {
    // Generate analytics data
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedTimeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredDocs = documents.filter(doc => doc.createdAt >= cutoffDate);

    // Type distribution
    const typeDistribution = filteredDocs.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Folder distribution
    const folderDistribution = filteredDocs.reduce((acc, doc) => {
      const folderName = doc.folderId 
        ? folders.find(f => f.id === doc.folderId)?.name || 'Unknown'
        : 'Root';
      acc[folderName] = (acc[folderName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Storage by type
    const storageByType = filteredDocs.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + doc.size;
      return acc;
    }, {} as Record<string, number>);

    // Upload trend (monthly)
    const uploadTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthDocs = documents.filter(doc => {
        const docDate = new Date(doc.createdAt);
        return docDate.getMonth() === date.getMonth() && 
               docDate.getFullYear() === date.getFullYear();
      });

      uploadTrend.push({
        month: monthKey,
        count: monthDocs.length,
        size: monthDocs.reduce((sum, doc) => sum + doc.size, 0)
      });
    }

    // Top documents (by downloads + size + recency)
    const topDocuments = documents
      .map(doc => ({
        document: doc,
        score: (doc.downloadCount || 0) * 10 + 
               (doc.size / 1024 / 1024) + // MB contribution
               (Date.now() - doc.updatedAt.getTime()) / (1000 * 60 * 60 * 24 * -1) // Recency bonus
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Recent activity (simulated)
    const recentActivity = documents
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10)
      .map(doc => ({
        type: 'updated',
        document: doc.name,
        date: doc.updatedAt
      }));

    setAnalytics({
      totalDocuments: filteredDocs.length,
      totalSize: filteredDocs.reduce((sum, doc) => sum + doc.size, 0),
      typeDistribution,
      folderDistribution,
      uploadTrend,
      topDocuments,
      storageByType,
      recentActivity
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getTypeColor = (type: string): string => {
    const colors = {
      pdf: '#EF4444',
      image: '#10B981',
      video: '#3B82F6',
      audio: '#F59E0B',
      spreadsheet: '#8B5CF6',
      text: '#6B7280',
      other: '#06B6D4'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen || !analytics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Document Analytics</h2>
              <p className="text-gray-600">Insights and statistics about your document management</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">{analytics.totalDocuments}</div>
              <div className="text-blue-100">Total Documents</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">{formatFileSize(analytics.totalSize)}</div>
              <div className="text-green-100">Total Storage</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">{Object.keys(analytics.typeDistribution).length}</div>
              <div className="text-purple-100">File Types</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">{Object.keys(analytics.folderDistribution).length}</div>
              <div className="text-orange-100">Folders</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Document Type Distribution */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Types</h3>
              <div className="space-y-3">
                {Object.entries(analytics.typeDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getTypeColor(type) }}
                      />
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(count / analytics.totalDocuments) * 100}%`,
                            backgroundColor: getTypeColor(type)
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage by Type */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Usage</h3>
              <div className="space-y-3">
                {Object.entries(analytics.storageByType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, size]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getTypeColor(type) }}
                      />
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(size / analytics.totalSize) * 100}%`,
                            backgroundColor: getTypeColor(type)
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">{formatFileSize(size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Trend */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Trend</h3>
            <div className="flex items-end space-x-4 h-48">
              {analytics.uploadTrend.map((item, index) => {
                const maxCount = Math.max(...analytics.uploadTrend.map(i => i.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 160 : 0;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-gray-600 mb-1">{item.count}</div>
                    <div
                      className="bg-blue-500 rounded-t transition-all duration-500 min-w-8"
                      style={{ height: `${height}px` }}
                    />
                    <div className="text-xs text-gray-500 mt-2 text-center">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Documents */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Documents</h3>
              <div className="space-y-3">
                {analytics.topDocuments.slice(0, 5).map((item, index) => (
                  <div key={item.document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded text-blue-800 text-xs flex items-center justify-center font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate max-w-48">{item.document.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{item.document.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.document.downloadCount || 0} downloads</div>
                      <div className="text-xs text-gray-500">{formatFileSize(item.document.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {analytics.recentActivity.slice(0, 8).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"/>
                      <div>
                        <div className="text-sm font-medium truncate max-w-48">{activity.document}</div>
                        <div className="text-xs text-gray-500">Document {activity.type}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Most Popular Type</h4>
                <p className="text-sm text-blue-700">
                  {Object.entries(analytics.typeDistribution).sort(([,a], [,b]) => b - a)[0]?.[0]?.toUpperCase() || 'N/A'} files make up the largest portion of your documents
                </p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Storage Efficiency</h4>
                <p className="text-sm text-blue-700">
                  Average file size is {formatFileSize(analytics.totalSize / analytics.totalDocuments || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;