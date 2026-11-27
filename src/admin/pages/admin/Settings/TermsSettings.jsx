import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

function TermsSettings() {
  const [termsData, setTermsData] = useState({
    title: 'Terms & Conditions',
    content: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const [savedData, setSavedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_BASE_URL = `${BASE_URL}/settings`;

  const getAdminId = () => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        return adminData.id;
      } catch (e) {
        console.error('Error parsing admin data:', e);
        return null;
      }
    }
    return null;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link',
  ];

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    const adminId = getAdminId();
    const token = getToken();

    if (!adminId) {
      setError('Admin ID not found. Please login again.');
      setFetchLoading(false);
      return;
    }

    try {
      setFetchLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/get-terms/${adminId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.data) {
        const { title, content, updatedAt } = response.data.data;
        const loaded = {
          title: title || 'Terms & Conditions',
          content: content || '',
          lastUpdated: updatedAt
            ? new Date(updatedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        };
        setTermsData(loaded);
        setSavedData(loaded);
        setIsEditing(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        const defaultData = {
          title: 'Terms & Conditions',
          content: '',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        setTermsData(defaultData);
        setSavedData(defaultData);
        setIsEditing(true);
      } else {
        console.error('Error fetching terms:', err);
        setError(err.response?.data?.message || 'Failed to fetch terms');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminId = getAdminId();
    const token = getToken();

    if (!adminId) {
      setError('Admin ID not found. Please login again.');
      return;
    }

    if (!termsData.content || termsData.content.trim() === '') {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.post(
        `${API_BASE_URL}/post-terms/${adminId}`,
        {
          title: termsData.title,
          content: termsData.content
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Terms & Conditions saved successfully!');
        const updated = {
          title: termsData.title,
          content: termsData.content,
          lastUpdated: response.data.data?.updatedAt
            ? new Date(response.data.data.updatedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        };
        setTermsData(updated);
        setSavedData(updated);
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving terms:', err);
      setError(err.response?.data?.message || 'Failed to save Terms & Conditions');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    if (savedData) {
      setTermsData({ ...savedData });
    }
    setIsEditing(false);
    setError('');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading Terms & Conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{termsData.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Last updated: {termsData.lastUpdated}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Preview
            </button>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Edit Content
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                type="button"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="termsTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="termsTitle"
                value={termsData.title}
                onChange={(e) => setTermsData({ ...termsData, title: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <div className={`border border-gray-300 rounded-md overflow-hidden bg-white ${!isEditing ? 'opacity-90' : ''}`}>
                <ReactQuill
                  theme="snow"
                  value={termsData.content}
                  onChange={(content) => setTermsData({ ...termsData, content })}
                  modules={isEditing ? modules : { toolbar: false }}
                  formats={formats}
                  placeholder="Paste or type policy content here..."
                  className="bg-white min-h-[300px]"
                  readOnly={!isEditing}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {isEditing
                  ? 'Editor is active. You can type, format, or paste policy documents.'
                  : 'Editor is read-only. Click "Edit Content" to paste or modify content.'}
              </p>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Preview</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{termsData.title}</h1>
              <p className="text-xs text-gray-500 mb-6">Last Updated: {termsData.lastUpdated}</p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: termsData.content }}
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleClosePreview}
                className="px-5 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TermsSettings;
