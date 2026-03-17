'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../dashboard.module.css';

export default function DailyUpdatesPage() {
    const { authFetch } = useAuth();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/posts?category=daily-updates');
            const data = await res.json();
            if (res.ok) {
                setUpdates(data.posts);
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
        fetchUpdates();
    }, [fetchUpdates]);

    return (
        <div className="animate-fadeIn">
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Daily Updates</h1>
                <p className="text-muted">Stay connected with the latest campus and regional news, announcements, and important notices.</p>
            </div>

            {loading ? (
                <div className="flex flex-col gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card skeleton h-48"></div>
                    ))}
                </div>
            ) : updates.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📢</div>
                    <div className="empty-title">Everything is quiet</div>
                    <p className="empty-desc">Check back later for today's campus highlights and official notices.</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto flex flex-col gap-8">
                    {updates.map((update, index) => (
                        <article
                            key={update._id}
                            className={`card overflow-hidden border-l-4 ${index === 0 ? 'bg-bg-tertiary border-l-primary' : 'border-l-accent-cyan'}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${index === 0 ? 'badge-primary' : 'badge-info'}`}>
                                        {index === 0 ? 'Top Story' : 'New Update'}
                                    </span>
                                    <span className="text-xs text-muted">
                                        {new Date(update.createdAt).toLocaleDateString()} at {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <h2 className={`font-bold mb-3 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>{update.title}</h2>
                            <div className="mb-6">
                                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                    {update.content}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-subtle flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Campus Main Office</span>
                                </div>
                                <button className="text-primary-light text-sm font-semibold hover:underline">
                                    Read More
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
