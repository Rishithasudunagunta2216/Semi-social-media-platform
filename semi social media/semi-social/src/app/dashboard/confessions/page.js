'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvTextarea } from '@/components/UvComponents';

export default function ConfessionsPage() {
    const { authFetch } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [confessionText, setConfessionText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchStatus = useCallback(async () => {
        try {
            const res = await authFetch('/api/admin/settings');
            const data = await res.json();
            if (res.ok) {
                setIsEnabled(data.confessionMode);
            }
        } catch (err) { }
    }, [authFetch]);

    const fetchConfessions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/confessions');
            const data = await res.json();
            if (res.ok) {
                setConfessions(data.confessions);
            } else {
                setError(data.error || 'Failed to fetch confessions');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchStatus();
        fetchConfessions();
    }, [fetchStatus, fetchConfessions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!confessionText.trim()) return;

        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await authFetch('/api/confessions', {
                method: 'POST',
                body: JSON.stringify({ confessionText: confessionText.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setConfessionText('');
                setMessage(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to submit confession');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="uv-page">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'start' }}>
                {/* FEED COLUMN */}
                <div>
                    <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="uv-mono-xs" style={{ fontWeight: 800, color: '#1a1a1a' }}>THE VOID: ANONYMOUS FEED</div>
                        <div style={{ height: '1px', flex: 1, background: 'var(--uv-border)' }}></div>
                    </div>

                    {loading ? (
                        <div className="uv-mono-sm">RECONSTRUCTING SECRETS...</div>
                    ) : confessions.length === 0 ? (
                        <div style={{ padding: '80px 40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid var(--uv-border)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤫</div>
                            <div className="uv-mono-sm">THE VOID IS SILENT</div>
                            <p style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>No approved entries found in the current cycle.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {confessions.map((c) => (
                                <UvPanel 
                                    key={c._id} 
                                    title={<UvTag color="purple">ANONYMOUS</UvTag>}
                                    headerActions={<div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</div>}
                                >
                                    <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#1a1a1a', fontStyle: 'italic', marginBottom: '20px' }}>
                                        "{c.confessionText}"
                                    </p>
                                    <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', opacity: 0.6 }}>#CAMPUS_SECRET</div>
                                </UvPanel>
                            ))}
                        </div>
                    )}
                </div>

                {/* SUBMISSION COLUMN */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    <UvPanel title="TRANSMIT SECRET">
                        {isEnabled ? (
                            <form onSubmit={handleSubmit}>
                                <div className="uv-mono-xs" style={{ marginBottom: '16px', color: 'var(--uv-muted)', lineHeight: 1.5 }}>
                                    ENCRYPTION ACTIVE. ENTRIES ARE SUBJECT TO ANONYMOUS REVIEW BEFORE BROADCAST.
                                </div>
                                <UvTextarea 
                                    placeholder="TYPE YOUR ANONYMOUS MESSAGE..."
                                    value={confessionText}
                                    onChange={(e) => setConfessionText(e.target.value)}
                                    disabled={submitting}
                                    style={{ marginBottom: '20px', minHeight: '180px' }}
                                />
                                {error && <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', marginBottom: '16px' }}>ERR: {error.toUpperCase()}</div>}
                                {message && <div className="uv-mono-xs" style={{ color: 'var(--uv-green)', marginBottom: '16px' }}>ACK: {message.toUpperCase()}</div>}
                                
                                <UvButton 
                                    type="submit" 
                                    disabled={submitting || !confessionText.trim()}
                                    style={{ width: '100%' }}
                                >
                                    {submitting ? 'TRANSMITTING...' : 'SEND TO VOID'}
                                </UvButton>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--uv-page-bg)', borderRadius: '12px', border: '1px solid var(--uv-border)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
                                <div className="uv-mono-sm" style={{ marginBottom: '8px' }}>VOID CLOSED</div>
                                <p style={{ fontSize: '12px', color: 'var(--uv-muted)' }}>Submissions are restricted to scheduled Friday sessions.</p>
                            </div>
                        )}
                    </UvPanel>
                </div>
            </div>
        </div>
    );
}
