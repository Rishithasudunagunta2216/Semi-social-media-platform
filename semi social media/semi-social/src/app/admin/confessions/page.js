'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

export default function ConfessionReviewPage() {
    const { authFetch } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected

    const fetchConfessions = useCallback(async () => {
        setLoading(true);
        try {
            let url = '/api/confessions?limit=100';
            if (filter === 'pending') url += '&pending=true';
            const res = await authFetch(url);
            const data = await res.json();
            if (res.ok) setConfessions(data.confessions);
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch, filter]);

    useEffect(() => {
        fetchConfessions();
    }, [fetchConfessions]);

    const handleAction = async (id, action) => {
        try {
            const res = await authFetch(`/api/confessions/${id}`, {
                method: action === 'delete' ? 'DELETE' : 'PATCH',
                body: action !== 'delete' ? JSON.stringify({ action }) : undefined,
            });
            if (res.ok) fetchConfessions();
        } catch (e) { }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Confession Review</h1>
                    <p className="text-muted">Review student confessions before they go public. AI score helps identify risky content.</p>
                </div>
                <div className="tab-nav">
                    <button className={`tab-item ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                    <button className={`tab-item ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>Approved</button>
                </div>
            </div>

            {loading ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="card skeleton h-40"></div>)}
                </div>
            ) : confessions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🤫</div>
                    <div className="empty-title">Inbox is empty</div>
                    <p className="empty-desc">No confessions current in this category.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {confessions.map((c) => (
                        <div key={c._id} className="card break-inside-avoid flex flex-col gap-4 border-l-4 border-l-accent-violet">
                            <div className="flex justify-between items-start">
                                <span className="badge badge-primary text-[10px]"># Confession</span>
                                <span className="text-[10px] text-muted font-bold">SPAM: {(c.aiSpamScore * 100).toFixed(0)}%</span>
                            </div>

                            <p className="text-sm italic text-text-primary">"{c.confessionText}"</p>

                            <div className="pt-3 border-t border-subtle flex justify-between items-center">
                                <div className="flex gap-2">
                                    {!c.isApproved && (
                                        <button className="btn btn-success btn-xs" onClick={() => handleAction(c._id, 'approve')}>Approve</button>
                                    )}
                                    {c.isApproved && (
                                        <button className="btn btn-warning btn-xs" onClick={() => handleAction(c._id, 'reject')}>Reject</button>
                                    )}
                                </div>
                                <button className="btn btn-danger btn-xs" onClick={() => handleAction(c._id, 'delete')}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
