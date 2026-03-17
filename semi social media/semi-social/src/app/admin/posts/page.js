'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

export default function ContentManagementPage() {
    const { authFetch } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'fest-updates',
        isPinned: false,
    });

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/posts');
            const data = await res.json();
            if (res.ok) setPosts(data.posts);
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingPost ? 'PATCH' : 'POST';
            const url = editingPost ? `/api/posts/${editingPost._id}` : '/api/posts';
            const res = await authFetch(url, {
                method,
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowModal(false);
                setEditingPost(null);
                setFormData({ title: '', content: '', category: 'fest-updates', isPinned: false });
                fetchPosts();
            }
        } catch (e) { }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await authFetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPosts();
        } catch (e) { }
    };

    const openEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
            isPinned: post.isPinned,
        });
        setShowModal(true);
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Content Management</h1>
                    <p className="text-muted">Create and manage announcements, fest updates, and educational materials.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingPost(null); setFormData({ title: '', content: '', category: 'fest-updates', isPinned: false }); setShowModal(true); }}>
                    Create New Post
                </button>
            </div>

            <div className="userTableContainer">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Pinned</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td>
                                    <div className="font-bold truncate max-w-xs">{post.title}</div>
                                </td>
                                <td>
                                    <span className={`badge ${post.category === 'fest-updates' ? 'badge-warning' : post.category === 'daily-updates' ? 'badge-info' : 'badge-success'}`}>
                                        {post.category.replace('-', ' ')}
                                    </span>
                                </td>
                                <td className="text-xs text-muted">{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td>{post.isPinned ? '✅' : '—'}</td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-secondary btn-xs" onClick={() => openEdit(post)}>Edit</button>
                                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(post._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-6">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    className="input-field"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="fest-updates">Fest Updates</option>
                                    <option value="daily-updates">Daily Updates</option>
                                    <option value="previous-year-papers">Materials & Papers</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Content</label>
                                <textarea
                                    className="input-field"
                                    rows="6"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="pin"
                                    checked={formData.isPinned}
                                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                />
                                <label htmlFor="pin" className="text-sm font-medium">Pin this post to top</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingPost ? 'Update Post' : 'Publish Post'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
