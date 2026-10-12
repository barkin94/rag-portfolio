'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Topic, TopicDefs } from '@/backend/shared/types';

type Chunk = {
  _id: string;
  id: string;
  pageContent: string;
  metadata: {
    tags: Topic[];
    source: string;
  };
  createdAt: string;
  updatedAt: string;
};

type ChunkListResponse = {
  chunks: Chunk[];
  total: number;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });

const truncate = (text: string, max = 100) =>
  text.length > max ? text.slice(0, max) + '…' : text;

export default function ChunksPage() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [filters, setFilters] = useState({
    topic: '' as string,
    source: '' as string,
    search: '' as string,
  });
  const [sources, setSources] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingChunk, setEditingChunk] = useState<Chunk | null>(null);
  const [formData, setFormData] = useState<{ id?: string; pageContent: string; tags: Topic[]; source: string }>({
    pageContent: '',
    tags: [],
    source: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchChunks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (filters.topic) params.set('topic', filters.topic);
      if (filters.source) params.set('source', filters.source);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/admin/chunks?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data: ChunkListResponse = await res.json();
        setChunks(data.chunks);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch chunks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chunks/sources', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    }
  }, []);

  useEffect(() => {
    fetchChunks();
    fetchSources();
  }, [fetchChunks, fetchSources]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingChunk(null);
    setFormData({ pageContent: '', tags: [], source: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (chunk: Chunk) => {
    setEditingChunk(chunk);
    setFormData({
      id: chunk.id,
      pageContent: chunk.pageContent,
      tags: chunk.metadata.tags,
      source: chunk.metadata.source,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChunk(null);
  };

  const handleFormChange = (field: string, value: string | Topic[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.pageContent.trim()) errors.pageContent = 'Content is required';
    if (formData.tags.length === 0) errors.tags = 'At least one topic is required';
    if (!formData.source.trim()) errors.source = 'Source is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const isCreate = !editingChunk;
      const url = editingChunk ? `/api/admin/chunks/${editingChunk.id}` : '/api/admin/chunks';
      const method = editingChunk ? 'PUT' : 'POST';
      
      const body: Record<string, unknown> = {
        pageContent: formData.pageContent,
        metadata: {
          tags: formData.tags,
          source: formData.source,
        },
      };
      // Only include ID on update (for reference), not on create
      if (!isCreate) {
        body.id = editingChunk!.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        closeModal();
        fetchChunks();
      } else {
        const data = await res.json();
        setFormErrors({ submit: data.error || 'Operation failed' });
      }
    } catch (error) {
      setFormErrors({ submit: 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chunk?')) return;

    try {
      const res = await fetch(`/api/admin/chunks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchChunks();
      } else {
        alert('Failed to delete chunk');
      }
    } catch (error) {
      alert('Failed to delete chunk');
    }
  };

  const allTopics = Object.values(Topic);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Chunks Management</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Chunk
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-foreground/70 mb-1">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search in content..."
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-foreground/70 mb-1">Topic</label>
          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Topics</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic} ({TopicDefs[topic]})
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-foreground/70 mb-1">Source</label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chunks List */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-foreground/60">Loading chunks…</div>
        ) : chunks.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">No chunks found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Content Preview</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Topics</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground/70">Updated</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {chunks.map((chunk) => (
                    <tr key={chunk._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm text-foreground/70 max-w-md">
                        {truncate(chunk.pageContent.replace(/\n/g, ' '))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {chunk.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground/70">{chunk.metadata.source}</td>
                      <td className="px-4 py-3 text-sm text-foreground/50">{formatDate(chunk.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(chunk)}
                            className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(chunk.id)}
                            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm text-foreground/60">
                  Page {page} of {totalPages} ({total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-foreground">
                {editingChunk ? 'Edit Chunk' : 'Create Chunk'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formErrors.submit && (
                <div className="text-red-600 dark:text-red-400 text-sm">{formErrors.submit}</div>
              )}

              {editingChunk && (
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground/60 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-foreground/50">Auto-generated on create</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Content</label>
                <textarea
                  value={formData.pageContent}
                  onChange={(e) => handleFormChange('pageContent', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                {formErrors.pageContent && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pageContent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Topics</label>
                <div className="flex flex-wrap gap-2">
                  {allTopics.map((topic) => (
                    <label
                      key={topic}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        formData.tags.includes(topic)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(topic)}
                        onChange={() =>
                          handleFormChange(
                            'tags',
                            formData.tags.includes(topic)
                              ? formData.tags.filter((t) => t !== topic)
                              : [...formData.tags, topic]
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
                {formErrors.tags && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.tags}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleFormChange('source', e.target.value)}
                  list="sources"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="sources">
                  {sources.map((source) => (
                    <option key={source} value={source} />
                  ))}
                </datalist>
                {formErrors.source && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.source}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving…' : editingChunk ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}