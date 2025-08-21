import React, { useState, useEffect } from 'react';
import { Search, Plus, Link2 as LinkIcon, Calendar, Tag, ExternalLink, Trash2, Edit3 } from 'lucide-react';

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  favicon?: string;
}

function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: ''
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleLinks: LinkItem[] = [
      {
        id: '1',
        url: 'https://react.dev',
        title: 'React Documentation',
        description: 'The official React documentation with guides, API reference, and tutorials for building user interfaces.',
        tags: ['react', 'javascript', 'frontend', 'documentation'],
        createdAt: new Date('2024-01-15'),
        favicon: '⚛️'
      },
      {
        id: '2',
        url: 'https://tailwindcss.com',
        title: 'Tailwind CSS',
        description: 'A utility-first CSS framework for rapidly building custom designs without leaving your HTML.',
        tags: ['css', 'tailwind', 'styling', 'frontend'],
        createdAt: new Date('2024-01-10'),
        favicon: '🎨'
      },
      {
        id: '3',
        url: 'https://nextjs.org',
        title: 'Next.js Framework',
        description: 'The React framework for production with features like server-side rendering, static generation, and more.',
        tags: ['nextjs', 'react', 'framework', 'fullstack'],
        createdAt: new Date('2024-01-05'),
        favicon: '▲'
      }
    ];
    setLinks(sampleLinks);
  }, []);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.url || !formData.title) return;
    
    if (editingLink) {
      // Update existing link
      setLinks(prevLinks => 
        prevLinks.map(link => 
          link.id === editingLink.id 
            ? {
                ...link,
                url: formData.url,
                title: formData.title,
                description: formData.description,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
              }
            : link
        )
      );
      setEditingLink(null);
    } else {
      // Add new link
      const newLink: LinkItem = {
        id: Date.now().toString(),
        url: formData.url,
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date(),
        favicon: '🔗'
      };
      setLinks(prevLinks => [newLink, ...prevLinks]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ url: '', title: '', description: '', tags: '' });
    setShowAddModal(false);
    setEditingLink(null);
  };

  const handleEdit = (link: LinkItem) => {
    setEditingLink(link);
    setFormData({
      url: link.url,
      title: link.title,
      description: link.description,
      tags: link.tags.join(', ')
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Link Dashboard</h1>
              <p className="text-gray-600 mt-1">Save, organize, and search your important links</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Link
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search links by title, description, tags, or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? 'No matching links found' : 'No links saved yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first link'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{link.favicon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {link.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(link.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(link)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit link"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {link.description}
                </p>

                {/* Tags */}
                {link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag className="h-4 w-4 text-gray-400" />
                    {link.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* URL and Visit Button */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">
                        {link.url}
                      </p>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the link"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, javascript, tutorial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLink ? 'Update Link' : 'Save Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;