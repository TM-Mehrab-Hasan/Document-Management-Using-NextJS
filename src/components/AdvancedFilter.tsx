'use client';

import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { DocumentType } from '@/types/document';

interface FilterOptions {
  type: DocumentType | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sizeRange: 'all' | 'small' | 'medium' | 'large';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const { documents } = useDocuments();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    dateRange: 'all',
    sizeRange: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [stats, setStats] = useState({
    totalDocs: 0,
    filteredDocs: 0,
    types: {} as Record<string, number>,
  });

  useEffect(() => {
    const typeCount = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalDocs: documents.length,
      filteredDocs: documents.length,
      types: typeCount,
    });
  }, [documents]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      type: 'all',
      dateRange: 'all',
      sizeRange: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
  };

  const getSizeLabel = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Advanced Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Type Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Document Type</h3>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types ({stats.totalDocs})</option>
              {Object.entries(stats.types).map(([type, count]) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Date Range</h3>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* File Size Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">File Size</h3>
            <select
              value={filters.sizeRange}
              onChange={(e) => handleFilterChange('sizeRange', e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (&lt; 1MB)</option>
              <option value="medium">Medium (1MB - 10MB)</option>
              <option value="large">Large (&gt; 10MB)</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Sort By</h3>
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="date">Date Modified</option>
                <option value="size">File Size</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Filter Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Type: <span className="font-medium">{filters.type === 'all' ? 'All Types' : filters.type}</span></p>
            <p>Date: <span className="font-medium">{filters.dateRange === 'all' ? 'All Time' : filters.dateRange}</span></p>
            <p>Size: <span className="font-medium">{filters.sizeRange === 'all' ? 'All Sizes' : filters.sizeRange}</span></p>
            <p>Sort: <span className="font-medium">{filters.sortBy} ({filters.sortOrder})</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;