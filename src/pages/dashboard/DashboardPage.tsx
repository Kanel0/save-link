import React, { useState, useEffect } from 'react';
import { Search, Plus, Link2 as LinkIcon, Calendar, Tag, ExternalLink, Trash2, Edit3, Sparkles, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  userId: string;
  favicon?: string;
}

function DashboardPage() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: ''
  });

  // Redirection si non authentifié
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Écouter les liens de l'utilisateur en temps réel
  useEffect(() => {
    if (!user) return;

    const linksQuery = query(
      collection(db, 'links'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(linksQuery, (snapshot) => {
      const userLinks: LinkItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        userLinks.push({
          id: doc.id,
          url: data.url,
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          userId: data.userId,
          favicon: data.favicon || '🔗'
        });
      });
      setLinks(userLinks);
    });

    return () => unsubscribe();
  }, [user]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.url || !formData.title || !user) return;
    
    setIsSubmitting(true);

    try {
      if (editingLink) {
        // Mettre à jour le lien existant
        const linkRef = doc(db, 'links', editingLink.id);
        await updateDoc(linkRef, {
          url: formData.url,
          title: formData.title,
          description: formData.description,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: serverTimestamp()
        });
        setEditingLink(null);
      } else {
        // Ajouter un nouveau lien
        await addDoc(collection(db, 'links'), {
          url: formData.url,
          title: formData.title,
          description: formData.description,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          createdAt: serverTimestamp(),
          userId: user.uid,
          favicon: '🔗'
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'links', id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-sm bg-slate-800/80 border-b border-purple-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                <Sparkles className="mr-3 text-purple-400 animate-pulse" size={32} />
                SaveLink Dashboard
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Save, organize, and search your important links</p>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 bg-slate-700/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-purple-500/20">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user.displayName || 'Utilisateur'}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>

              {/* Add Link Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add Link
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-110"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search links by title, description, tags, or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 shadow-xl transition-all duration-300 hover:border-purple-400/40"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Links</p>
                <p className="text-2xl font-bold text-white">{links.length}</p>
              </div>
              <LinkIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tags Used</p>
                <p className="text-2xl font-bold text-white">
                  {[...new Set(links.flatMap(link => link.tags))].length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {links.filter(link => {
                    const now = new Date();
                    const linkDate = new Date(link.createdAt);
                    return linkDate.getMonth() === now.getMonth() && linkDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <LinkIcon className="mx-auto h-16 w-16 text-purple-400 animate-bounce" />
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl"></div>
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-200">
              {searchTerm ? 'No matching links found' : 'No links saved yet'}
            </h3>
            <p className="mt-2 text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first link'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredLinks.map((link, index) => (
              <div
                key={link.id}
                className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Animated border glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                {/* Card Header */}
                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="text-3xl mr-4 filter drop-shadow-lg">{link.favicon}</span>
                      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-purple-200 transition-colors duration-300">
                        {link.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-2">
                        <Calendar className="h-4 w-4 mr-1 text-purple-400" />
                        {formatDate(link.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300 hover:scale-110"
                      title="Edit link"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:scale-110"
                      title="Delete link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5 group-hover:text-gray-200 transition-colors duration-300">
                  {link.description}
                </p>

                {/* Tags */}
                {link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <Tag className="h-4 w-4 text-purple-400" />
                    {link.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-default hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* URL and Visit Button */}
                <div className="relative border-t border-purple-500/20 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                        {link.url}
                      </p>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm text-white text-sm rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 group/button"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3 ml-1 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full p-8 border border-purple-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-3 flex items-center justify-center">
                {editingLink ? <Edit3 className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
              </div>
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-slate-700/80 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                  className="w-full px-4 py-3 bg-slate-700/80 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the link"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/80 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, javascript, tutorial"
                  className="w-full px-4 py-3 bg-slate-700/80 backdrop-blur-sm border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-300 bg-slate-600/80 backdrop-blur-sm rounded-xl hover:bg-slate-600 transition-all duration-300 hover:scale-105"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.url || !formData.title}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    editingLink ? 'Update Link' : 'Save Link'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;