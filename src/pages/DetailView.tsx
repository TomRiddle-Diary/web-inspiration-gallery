import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy, Check, Trash2, Edit2, X, Save } from 'lucide-react';
import { SavedWebsite } from '../types';
import { api } from '../api';

const CATEGORIES = [
  'Landing Pages',
  'E-commerce',
  'Portfolio',
  'Blog',
  'Restaurant',
  'Technology',
  'Agency',
  'SaaS',
  'Fashion',
  'Education',
  'Other'
];

function DetailView() {
  const { id, projectId } = useParams<{ id: string; projectId?: string }>();
  const navigate = useNavigate();
  const [website, setWebsite] = useState<SavedWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [editedCategories, setEditedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadWebsite(id);
    }
  }, [id]);

  const loadWebsite = async (websiteId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getWebsiteById(websiteId);
      setWebsite(data);
    } catch (err) {
      console.error('Error loading website:', err);
      setError('Failed to load website details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDelete = async () => {
    if (!website || !confirm('Are you sure you want to delete this website?')) {
      return;
    }
    
    try {
      await api.deleteWebsite(website.id);
      if (projectId) {
        navigate(`/project/${projectId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Failed to delete website');
    }
  };

  const handleEditCategories = () => {
    if (website) {
      setEditedCategories(website.categories || (website.category ? [website.category] : []));
      setIsEditingCategories(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCategories(false);
    setEditedCategories([]);
  };

  const toggleEditCategory = (cat: string) => {
    setEditedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSaveCategories = async () => {
    if (!website) return;
    
    try {
      setIsSaving(true);
      const updated = await api.updateWebsiteCategories(website.id, editedCategories);
      setWebsite(updated);
      setIsEditingCategories(false);
    } catch (err) {
      alert('Failed to update categories');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTags = () => {
    if (website) {
      setEditedTags(website.tags || []);
      setIsEditingTags(true);
    }
  };

  const handleCancelTagsEdit = () => {
    setIsEditingTags(false);
    setEditedTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(t => t !== tagToRemove));
  };

  const handleSaveTags = async () => {
    if (!website) return;
    
    try {
      setIsSaving(true);
      const updated = await api.updateWebsiteTags(website.id, editedTags);
      setWebsite(updated);
      setIsEditingTags(false);
      setTagInput('');
    } catch (err) {
      alert('Failed to update tags');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNotes = () => {
    if (website) {
      setEditedNotes(website.notes || '');
      setIsEditingNotes(true);
    }
  };

  const handleCancelNotesEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes('');
  };

  const handleSaveNotes = async () => {
    if (!website) return;
    
    try {
      setIsSaving(true);
      const updated = await api.updateWebsiteNotes(website.id, editedNotes);
      setWebsite(updated);
      setIsEditingNotes(false);
    } catch (err) {
      alert('Failed to update notes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website details...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Website not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(projectId ? `/project/${projectId}` : '/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Gallery</span>
            </button>
            
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <img 
            src={`http://localhost:3001${website.heroImage}`}
            alt={website.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Website Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{website.title}</h1>
          <a 
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 underline mb-4 inline-block"
          >
            {website.url}
          </a>
          
          {/* Categories Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
              {!isEditingCategories && (
                <button
                  onClick={handleEditCategories}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingCategories ? (
              <div>
                {(website.categories || (website.category ? [website.category] : [])).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(website.categories || [website.category]).map((cat, idx) => (
                      <span key={idx} className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No categories selected</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {CATEGORIES.map(cat => (
                    <label
                      key={cat}
                      className="flex items-center py-2 hover:bg-gray-50 cursor-pointer rounded px-2"
                    >
                      <input
                        type="checkbox"
                        checked={editedCategories.includes(cat)}
                        onChange={() => toggleEditCategory(cat)}
                        className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900">{cat}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCategories}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Tags Section */}
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
              {!isEditingTags && (
                <button
                  onClick={handleEditTags}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingTags ? (
              <div>
                {(website.tags || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {website.tags!.map((tag, idx) => (
                      <span key={idx} className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tags added</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Enter (e.g., hero-layout)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {editedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {editedTags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-green-900 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTags}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelTagsEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
              {!isEditingNotes && (
                <button
                  onClick={handleEditNotes}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingNotes ? (
              <div>
                {website.notes ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-amber-50 p-3 rounded-lg border border-amber-200">
                    {website.notes}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No notes added</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add your notes here... (e.g., 'Love the CTA placement', 'Check pricing section')"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm min-h-[120px]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelNotesEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {website.mainFont && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Main Font</p>
              <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: website.mainFont }}>
                {website.mainFont}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Saved on {new Date(website.savedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Colors Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Palette</h2>
            
            {website.colorCategories ? (
              <div className="space-y-6">
                {/* Base Colors */}
                {website.colorCategories.base.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Base</h3>
                    <div className="space-y-2">
                      {website.colorCategories.base.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-16 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                            <button 
                              onClick={() => handleCopyColor(color)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedColor === color ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Primary Colors */}
                {website.colorCategories.primary.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Primary</h3>
                    <div className="space-y-2">
                      {website.colorCategories.primary.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-16 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                            <button 
                              onClick={() => handleCopyColor(color)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedColor === color ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Accent Colors */}
                {website.colorCategories.accent.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Accent</h3>
                    <div className="space-y-2">
                      {website.colorCategories.accent.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-16 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                            <button 
                              onClick={() => handleCopyColor(color)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedColor === color ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Other Colors */}
                {website.colorCategories.other.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Other</h3>
                    <div className="space-y-2">
                      {website.colorCategories.other.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-16 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                            <button 
                              onClick={() => handleCopyColor(color)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedColor === color ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {website.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-16 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                      <button 
                        onClick={() => handleCopyColor(color)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedColor === color ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fonts Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography</h2>
            <div className="space-y-4">
              {website.fonts.map((font, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-1">Font Family</p>
                  <p className="font-semibold text-gray-900" style={{ fontFamily: font }}>
                    {font}
                  </p>
                  <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: font }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailView;
