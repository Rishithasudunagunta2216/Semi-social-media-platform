'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvInput, UvTextarea } from '@/components/UvComponents';

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
        if (!confirm('Permanently delete this post?')) return;
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

    const getCatColor = (cat) => {
        if (cat === 'fest-updates') return 'orange';
        if (cat === 'daily-updates') return 'blue';
        return 'green';
    };

    return (
        <div className="uv-page">
            <UvPanel 
                title="System Publications" 
                headerActions={
                    <UvButton onClick={() => { setEditingPost(null); setFormData({ title: '', content: '', category: 'fest-updates', isPinned: false }); setShowModal(true); }}>
                        + CREATE PUBLICATION
                    </UvButton>
                }
            >
                {loading ? (
                    <div className="uv-mono-sm" style={{ padding: '40px 0' }}>LOADING REPOSITORY...</div>
                ) : (
                    <table className="uv-table">
                        <thead>
                            <tr>
                                <th>Publication Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id}>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{post.title}</div>
                                        {post.isPinned && <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', marginTop: '4px' }}>★ PINNED TO TOP</div>}
                                    </td>
                                    <td>
                                        <UvTag color={getCatColor(post.category)}>{post.category.replace('-', ' ')}</UvTag>
                                    </td>
                                    <td className="uv-mono-xs">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <UvBadge status="answered">LIVE</UvBadge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <UvButton variant="outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEdit(post)}>EDIT</UvButton>
                                            <UvButton variant="outline" style={{ padding: '6px 12px', fontSize: '12px', color: '#d00' }} onClick={() => handleDelete(post._id)}>DEL</UvButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </UvPanel>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,14,20,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="uv-panel animate-scaleIn" style={{ maxWidth: '600px', width: '100%', margin: 0 }}>
                        <div className="uv-panel-header">
                            <h2 style={{ fontFamily: 'var(--uv-font-heading)' }}>{editingPost ? 'Edit Publication' : 'Create New Publication'}</h2>
                            <UvButton variant="outline" style={{ padding: '4px 10px' }} onClick={() => setShowModal(false)}>✕</UvButton>
                        </div>
                        <form onSubmit={handleSubmit} className="uv-panel-body">
                            <UvInput 
                                label="Title" 
                                value={formData.title} 
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                                required 
                            />
                            
                            <div className="uv-form-group">
                                <label>Category</label>
                                <select 
                                    className="uv-input" 
                                    value={formData.category} 
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="fest-updates">Fest Updates</option>
                                    <option value="daily-updates">Daily Updates</option>
                                    <option value="previous-year-papers">Materials & Papers</option>
                                </select>
                            </div>

                            <UvTextarea 
                                label="Body Content" 
                                rows="6" 
                                value={formData.content} 
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                                required 
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <input 
                                    type="checkbox" 
                                    id="pin" 
                                    checked={formData.isPinned} 
                                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--uv-primary)' }}
                                />
                                <label htmlFor="pin" className="uv-mono-xs" style={{ fontWeight: 600, cursor: 'pointer' }}>PIN THIS PUBLICATION</label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <UvButton type="submit" style={{ flex: 1 }}>{editingPost ? 'UPDATE PUBLICATION' : 'PUBLISH NOW'}</UvButton>
                                <UvButton type="button" variant="outline" onClick={() => setShowModal(false)}>CANCEL</UvButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}
