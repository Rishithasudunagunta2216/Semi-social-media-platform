'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton } from '@/components/UvComponents';

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
        return (
            <div className="uv-page" style={{ padding: '40px 0' }}>
                <div className="uv-mono-sm">FETCHING METRICS...</div>
            </div>
        );
    }

    return (
        <div className="uv-page">
            {/* STAT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {[
                    { label: 'Enrolled Students', value: stats?.totalStudents || 0, icon: '👥', color: 'orange' },
                    { label: 'Flagged Doubts', value: stats?.flaggedQuestions || 0, icon: '🛡️', color: 'purple' },
                    { label: 'Pending Confessions', value: stats?.pendingConfessions || 0, icon: 'blue', color: 'blue' },
                    { label: 'Published Updates', value: stats?.totalPosts || 0, icon: '📄', color: 'green' }
                ].map((stat, i) => (
                    <div key={i} className="uv-panel" style={{ margin: 0, padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ fontSize: '24px' }}>{typeof stat.icon === 'string' && stat.icon.length > 2 ? '📄' : stat.icon}</div>
                            <UvTag color={stat.color}>{stat.label.split(' ')[0]}</UvTag>
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--uv-font-heading)' }}>{stat.value}</div>
                        <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)', marginTop: '4px' }}>{stat.label.toUpperCase()}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                {/* MODERATION QUEUE */}
                <UvPanel title="Moderation Alerts" headerActions={<UvBadge status="pending">LIVE</UvBadge>}>
                    {recentFlagged.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                            <p className="uv-muted">No questions flagged for review.</p>
                        </div>
                    ) : (
                        <table className="uv-table">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Content Snippet</th>
                                    <th>Score</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFlagged.map((q) => (
                                    <tr key={q._id}>
                                        <td className="uv-mono-xs">{new Date(q.createdAt).toLocaleTimeString()}</td>
                                        <td style={{ maxWidth: '200px' }} className="truncate">{q.questionText}</td>
                                        <td>
                                            <UvBadge status="pending">{(q.aiSpamScore * 100).toFixed(0)}% SPAM</UvBadge>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <UvButton variant="outline" style={{ padding: '6px 12px', fontSize: '12px' }}>REVIEW</UvButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </UvPanel>

                {/* SYSTEM CONTROLS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <UvPanel title="Platform Safety">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Confession Mode</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>FRIDAY ANONYMOUS MODULE</div>
                            </div>
                            <UvButton 
                                variant={stats?.confessionModeEnabled ? 'primary' : 'outline'}
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                onClick={async () => {
                                    const newVal = !stats.confessionModeEnabled;
                                    await authFetch('/api/admin/settings', {
                                        method: 'PATCH',
                                        body: JSON.stringify({ confessionMode: newVal }),
                                    });
                                    setStats({ ...stats, confessionModeEnabled: newVal });
                                }}
                            >
                                {stats?.confessionModeEnabled ? 'ENABLED' : 'DISABLED'}
                            </UvButton>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Open Registration</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>NEW STUDENT ACCESS</div>
                            </div>
                            <UvButton variant="primary" style={{ padding: '8px 16px', fontSize: '12px' }}>ACTIVE</UvButton>
                        </div>
                    </UvPanel>

                    <UvPanel title="Quick Actions">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <UvButton variant="outline" style={{ fontSize: '11px', padding: '10px' }}>📢 POST UPDATE</UvButton>
                            <UvButton variant="outline" style={{ fontSize: '11px', padding: '10px' }}>📚 UPLOAD DOC</UvButton>
                            <UvButton variant="outline" style={{ fontSize: '11px', padding: '10px' }}>✉️ EMAIL LIST</UvButton>
                            <UvButton variant="outline" style={{ fontSize: '11px', padding: '10px' }}>🔍 AUDIT LOGS</UvButton>
                        </div>
                    </UvPanel>
                </div>
            </div>
        </div>
    );
}
