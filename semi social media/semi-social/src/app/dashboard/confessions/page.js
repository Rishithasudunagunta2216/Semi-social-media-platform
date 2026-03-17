'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../dashboard.module.css';

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
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Campus Confessions</h1>
                    <p className="text-muted">Share your thoughts anonymously. Every Friday, admin opens the floodgates!</p>
                </div>
                {!isEnabled && (
                    <div className="badge badge-danger">Closed (Only on Fridays)</div>
                )}
                {isEnabled && (
                    <div className="badge badge-success">Open for Entries</div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="card border border-subtle h-fit sticky top-28">
                        <h3 className="text-lg font-bold mb-4">Post a Confession</h3>
                        {isEnabled ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <p className="text-xs text-muted mb-2">
                                    Confessions are anonymous to other students, but are reviewed by the admin before being posted publicly.
                                </p>
                                <div className="input-group">
                                    <textarea
                                        className="input-field"
                                        placeholder="Write your secret..."
                                        rows="6"
                                        value={confessionText}
                                        onChange={(e) => setConfessionText(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>
                                {error && <div className="text-accent-rose text-sm font-medium">{error}</div>}
                                {message && <div className="text-accent-emerald text-sm font-medium">{message}</div>}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={submitting || !confessionText.trim()}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Secret'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-10 flex flex-col items-center gap-4">
                                <div className="text-4xl">🔒</div>
                                <p className="text-sm text-text-secondary font-medium">Submission is disabled.</p>
                                <p className="text-xs text-muted">Confessions are enabled ONLY on Fridays by the admin.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6">Wall of Secrets</h3>
                    {loading ? (
                        <div className="flex flex-col gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="card skeleton h-32 w-full"></div>
                            ))}
                        </div>
                    ) : confessions.length === 0 ? (
                        <div className="empty-state card bg-bg-secondary border-dashed">
                            <div className="empty-icon">🤫</div>
                            <div className="empty-title">Silence... for now</div>
                            <p className="empty-desc">No confessions have been approved yet. If you've submitted one, it's currently under review.</p>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {confessions.map((c) => (
                                <div
                                    key={c._id}
                                    className="card break-inside-avoid bg-bg-card hover:border-accent-violet transition-all transform hover:-rotate-1"
                                >
                                    <p className="text-text-primary text-sm leading-relaxed mb-4 italic">
                                        "{c.confessionText}"
                                    </p>
                                    <div className="flex justify-between items-center pt-3 border-t border-subtle border-opacity-30">
                                        <span className="text-[10px] text-accent-violet font-bold uppercase tracking-wider">#Confession</span>
                                        <span className="text-[10px] text-muted">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
