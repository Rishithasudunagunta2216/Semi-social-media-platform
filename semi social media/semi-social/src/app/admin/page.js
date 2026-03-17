'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const { authFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentFlagged, setRecentFlagged] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await authFetch('/api/admin/stats');
                const data = await res.json();
                if (res.ok) {
                    setStats(data.stats);
                    setRecentFlagged(data.recentFlagged);
                }
            } catch (err) {
                console.error('Failed to fetch admin stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [authFetch]);

    if (loading) {
        return <div className="animate-pulse">Loading dashboard metrics...</div>;
    }

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8">System Overview</h1>

            <div className="grid-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-glow)', color: 'var(--primary-light)' }}>👥</div>
                    <div className="stat-value">{stats?.totalStudents || 0}</div>
                    <div className="stat-label">Total Students</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}>🛡️</div>
                    <div className="stat-value">{stats?.flaggedQuestions || 0}</div>
                    <div className="stat-label">Flagged Doubts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)' }}>🤫</div>
                    <div className="stat-value">{stats?.pendingConfessions || 0}</div>
                    <div className="stat-label">Pending Confessions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>📄</div>
                    <div className="stat-value">{stats?.totalPosts || 0}</div>
                    <div className="stat-label">Active Posts</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="card border border-subtle">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">AI Moderation Alerts</h3>
                        <span className="badge badge-danger">Urgent</span>
                    </div>

                    {recentFlagged.length === 0 ? (
                        <div className="py-10 text-center text-muted text-sm">
                            All good! No questions currently flagged by AI.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {recentFlagged.map((q) => (
                                <div key={q._id} className="p-4 rounded-lg bg-bg-secondary border border-subtle hover:border-accent-rose transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-accent-rose">SPAM SCORE: {(q.aiSpamScore * 100).toFixed(0)}%</span>
                                        <span className="text-[10px] text-muted">{new Date(q.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm line-clamp-2 mb-3">"{q.questionText}"</p>
                                    <div className="flex gap-2">
                                        <button className="btn btn-secondary btn-xs">Review</button>
                                        <button className="btn btn-danger btn-xs">Block User</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card border border-subtle">
                    <h3 className="text-lg font-bold mb-6">System Controls</h3>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-bg-secondary">
                            <div>
                                <p className="font-semibold">Confession Mode</p>
                                <p className="text-xs text-muted">Enable/Disable student confessions submission.</p>
                            </div>
                            <div
                                className={`toggle ${stats?.confessionModeEnabled ? 'active' : ''}`}
                                onClick={async () => {
                                    try {
                                        const newVal = !stats.confessionModeEnabled;
                                        await authFetch('/api/admin/settings', {
                                            method: 'PATCH',
                                            body: JSON.stringify({ confessionMode: newVal }),
                                        });
                                        setStats({ ...stats, confessionModeEnabled: newVal });
                                    } catch (e) { }
                                }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-bg-secondary">
                            <div>
                                <p className="font-semibold">Site Registration</p>
                                <p className="text-xs text-muted">Close registration to new students.</p>
                            </div>
                            <div className="toggle active"></div>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-sm font-bold text-muted uppercase mb-3">Quick Actions</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="btn btn-secondary text-sm">Post Update</button>
                                <button className="btn btn-secondary text-sm">Upload Material</button>
                                <button className="btn btn-secondary text-sm">Broadcast Email</button>
                                <button className="btn btn-secondary text-sm">Audit Log</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
