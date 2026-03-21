'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton } from '@/components/UvComponents';

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
        <div className="uv-page">
            {loading ? (
                <div className="uv-mono-sm">FETCHING GLOBAL RELEASES...</div>
            ) : updates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '14px', border: '1px solid var(--uv-border)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📡</div>
                    <div className="uv-mono-sm">NO NEW RELEASES</div>
                    <p style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>The university broadcast is currently on standby. Check back for live updates.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '800px' }}>
                    {updates.map((update, index) => (
                        <UvPanel 
                            key={update._id} 
                            title={index === 0 ? <UvTag color="orange">PRIORITY BROADCAST</UvTag> : <UvTag color="blue">CAMPUS NEWS</UvTag>}
                            headerActions={<div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>{new Date(update.createdAt).toLocaleDateString()}</div>}
                        >
                            <div style={{ marginBottom: '32px' }}>
                                <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: index === 0 ? '32px' : '24px', fontWeight: 900, marginBottom: '20px', lineHeight: 1.2 }}>{update.title}</h1>
                                <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#1a1a1a', fontWeight: 400, whiteSpace: 'pre-wrap' }}>{update.content}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--uv-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--uv-page-bg)', border: '1px solid var(--uv-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>U</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="uv-mono-xs" style={{ fontWeight: 800 }}>UNIVERA PRESS</span>
                                        <span className="uv-mono-xs" style={{ color: 'var(--uv-muted)', fontSize: '10px' }}>OFFICIAL RELEASE</span>
                                    </div>
                                </div>
                                <UvButton variant="outline" style={{ fontSize: '11px' }}>SHARE ARCHIVE</UvButton>
                            </div>
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
