'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton } from '@/components/UvComponents';

export default function ConfessionReviewPage() {
    const { authFetch } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved

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
        <div className="uv-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <UvButton variant={filter === 'pending' ? 'primary' : 'outline'} style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setFilter('pending')}>PENDING APPROVAL</UvButton>
                    <UvButton variant={filter === 'approved' ? 'primary' : 'outline'} style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setFilter('approved')}>LIVE FEED</UvButton>
                </div>
            </div>

            {loading ? (
                <div className="uv-mono-sm" style={{ padding: '40px 0' }}>SCREENING ANONYMOUS INBOX...</div>
            ) : confessions.length === 0 ? (
                <div className="uv-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤫</div>
                    <h2 style={{ fontFamily: 'var(--uv-font-heading)', marginBottom: '12px' }}>Inbox Empty</h2>
                    <p className="uv-muted">No confessions in this category require action.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                    {confessions.map((c) => (
                        <UvPanel 
                            key={c._id} 
                            title={<UvTag color="purple">CONFESSION</UvTag>}
                            headerActions={<div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>ID: {c._id.slice(-6).toUpperCase()}</div>}
                        >
                            <div style={{ marginBottom: '24px', minHeight: '100px' }}>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#1a1a1a', fontStyle: 'italic' }}>"{c.confessionText}"</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div className="uv-mono-xs" style={{ fontWeight: 600 }}>SPAM PROBABILITY:</div>
                                <UvBadge status={c.aiSpamScore > 0.6 ? 'pending' : 'answered'}>{(c.aiSpamScore * 100).toFixed(0)}%</UvBadge>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--uv-border)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {!c.isApproved ? (
                                        <UvButton variant="primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleAction(c._id, 'approve')}>APPROVE</UvButton>
                                    ) : (
                                        <UvButton variant="outline" style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--uv-primary)' }} onClick={() => handleAction(c._id, 'reject')}>REJECT</UvButton>
                                    )}
                                </div>
                                <UvButton variant="outline" style={{ padding: '6px 12px', fontSize: '11px', color: '#d00' }} onClick={() => handleAction(c._id, 'delete')}>DELETE</UvButton>
                            </div>
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
