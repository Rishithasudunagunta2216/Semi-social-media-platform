'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../dashboard.module.css';

export default function FestUpdatesPage() {
    const { authFetch } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/posts?category=fest-updates');
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts);
            } else {
                setError(data.error || 'Failed to fetch updates');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Fest Updates</h1>
                <p className="text-muted">Catch up on all the excitement! Browse schedules, announcements, and highlights of college fests.</p>
            </div>

            {loading ? (
                <div className="grid-cards">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton h-64"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-6 text-center text-accent-rose bg-bg-secondary rounded-xl border border-accent-rose style={{ borderColor: 'rgba(244, 63, 94, 0.2)' }}">
                    {error}
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎉</div>
                    <div className="empty-title">No fest updates yet</div>
                    <p className="empty-desc">Check back later for announcements about upcoming college festivals and events.</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {posts.map((post) => (
                        <div key={post._id} className="card flex flex-col h-full hover:border-primary transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="badge badge-warning">Fest Update</span>
                                {post.isPinned && (
                                    <span className="text-accent-amber" title="Pinned">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C10.9 2 10 2.9 10 4V10L8 12V14H11V20L12 22L13 20V14H16V12L14 10V4C14 2.9 13.1 2 12 2Z" />
                                        </svg>
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold mb-3">{post.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-4 mb-6 flex-1">{post.content}</p>

                            <div className="mt-auto pt-4 border-t border-subtle flex justify-between items-center text-xs text-muted">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-accent-amber flex items-center justify-center text-[10px] text-white">A</div>
                                    <span>Admin</span>
                                </div>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
