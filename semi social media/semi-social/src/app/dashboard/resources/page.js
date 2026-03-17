'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../dashboard.module.css';

export default function ResourcesPage() {
    const { authFetch } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/posts?category=previous-year-papers');
            const data = await res.json();
            if (res.ok) {
                setMaterials(data.posts);
            } else {
                setError(data.error || 'Failed to fetch materials');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Study Materials & Papers</h1>
                <p className="text-muted">Download previous year question papers, notes, and other academic resources uploaded by faculty.</p>
            </div>

            <div className="search-container mb-8 max-w-md">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search for subjects, years, or topics..."
                />
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton h-24"></div>
                    ))}
                </div>
            ) : materials.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <div className="empty-title">Hub is currently empty</div>
                    <p className="empty-desc">Materials will appear here as soon as the admin uploads them. Check back specifically before exams!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {materials.map((m) => (
                        <div key={m._id} className="card flex items-center justify-between hover:bg-bg-card-hover transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-accent-emerald style={{ background: 'rgba(16, 185, 129, 0.1)' }} flex items-center justify-center text-accent-emerald text-xl">
                                    📄
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary mb-1 group-hover:text-primary-light transition-colors">{m.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-muted">
                                        <span className="badge badge-success btn-xs">Resource</span>
                                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="btn btn-secondary btn-sm">
                                    View
                                </button>
                                <button className="btn btn-primary btn-sm">
                                    Download
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
