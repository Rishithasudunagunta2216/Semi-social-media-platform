'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton } from '@/components/UvComponents';

export default function ConfessionReviewPage() {
    const { authFetch } = useAuth();
    const [pending, setPending] = useState([]);
    const [approved, setApproved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionMode, setSessionMode] = useState(false);
    const [isFriday, setIsFriday] = useState(false);
    const [toggling, setToggling] = useState(false);

    const fetchSessionStatus = useCallback(async () => {
        try {
            const today = new Date();
            setIsFriday(today.getDay() === 5);
            const res = await authFetch('/api/admin/settings');
            const data = await res.json();
            if (res.ok) setSessionMode(data.confessionMode);
        } catch (e) { }
    }, [authFetch]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                authFetch('/api/admin/confessions?filter=pending&limit=50'),
                authFetch('/api/admin/confessions?filter=approved&limit=10')
            ]);
            
            const [pendingData, approvedData] = await Promise.all([
                pendingRes.json(),
                approvedRes.json()
            ]);

            if (pendingRes.ok) setPending(pendingData.confessions);
            if (approvedRes.ok) setApproved(approvedData.confessions);
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchSessionStatus();
        fetchData();
    }, [fetchSessionStatus, fetchData]);

    const toggleMode = async () => {
        setToggling(true);
        try {
            const newVal = !sessionMode;
            const res = await authFetch('/api/admin/settings', {
                method: 'PATCH',
                body: JSON.stringify({ confessionMode: newVal }),
            });
            if (res.ok) setSessionMode(newVal);
        } catch (e) { } finally {
            setToggling(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const res = await authFetch(`/api/admin/confessions/${id}`, {
                method: action === 'delete' ? 'DELETE' : 'PATCH',
                body: action !== 'delete' ? JSON.stringify({ action }) : undefined,
            });
            if (res.ok) {
                if (action === 'approve') {
                    const item = pending.find(c => c._id === id);
                    if (item) setApproved([ { ...item, is_approved: true }, ...approved.slice(0, 9)]);
                }
                setPending(pending.filter(c => c._id !== id));
                if (action === 'delete') setApproved(approved.filter(c => c._id !== id));
            }
        } catch (e) { }
    };

    const isSessionActive = isFriday || sessionMode;

    return (
        <div className="uv-page">
            {/* SESSION CONTROL HUD */}
            <div style={{ marginBottom: '40px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div>
                        <div className="uv-mono-xs" style={{ color: '#6b7280', marginBottom: '8px', letterSpacing: '0.1em' }}>GLOBAL STATUS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isSessionActive ? '#10b981' : '#ef4444', boxShadow: isSessionActive ? '0 0 10px #10b981' : 'none' }}></div>
                            <span style={{ fontWeight: 800, fontSize: '18px', color: '#111827' }}>{isSessionActive ? 'SESSION ACTIVE' : 'SYSTEM OFFLINE'}</span>
                        </div>
                    </div>
                    <div style={{ padding: '0 32px', borderLeft: '1px solid #e5e5e5' }}>
                        <div className="uv-mono-xs" style={{ color: '#6b7280', marginBottom: '8px' }}>SCHEDULED DAY</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '15px' }}>Friday</span>
                            {isFriday ? <UvBadge status="answered">CURRENT</UvBadge> : <UvBadge status="pending">PENDING</UvBadge>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>Manual Override</div>
                        <div className="uv-mono-xs" style={{ color: '#6b7280' }}>FORCE ENABLE OUTSIDE FRIDAYS</div>
                    </div>
                    <UvButton 
                        variant={sessionMode ? 'primary' : 'outline'}
                        onClick={toggleMode}
                        disabled={toggling}
                        style={{ minWidth: '120px' }}
                    >
                        {toggling ? 'SYNCING...' : sessionMode ? 'DEACTIVATE' : 'ACTIVATE'}
                    </UvButton>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '40px', alignItems: 'start' }}>
                {/* MODERATION QUEUE */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontFamily: 'var(--uv-font-heading)', fontSize: '20px' }}>Moderation Inbox <span style={{ color: '#6b7280', fontWeight: 400, marginLeft: '8px' }}>({pending.length})</span></h3>
                    </div>

                    {loading ? (
                        <div className="uv-mono-sm">SCANNING FOR NEW SECRETS...</div>
                    ) : pending.length === 0 ? (
                        <div style={{ padding: '80px 40px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
                            <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#111827' }}>Zero Backlog</h2>
                            <p style={{ color: '#6b7280', marginBottom: '24px' }}>All recent confessions have been screened and processed.</p>
                            {!isSessionActive && (
                                <UvButton onClick={toggleMode} variant="outline">OPEN SESSION NOW</UvButton>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {pending.map((c) => (
                                <div key={c._id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                                    <div style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <UvTag color={c.target_student_email ? 'purple' : 'orange'}>
                                                    {c.target_student_email ? 'PRIVATE TARGET' : 'PUBLIC VOID'}
                                                </UvTag>
                                                <div className="uv-mono-xs" style={{ alignSelf: 'center', color: '#9ca3af' }}>ID: {c._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(c.createdAt).toLocaleTimeString()}</div>
                                        </div>
                                        
                                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1f2937', margin: '0 0 20px 0', fontStyle: 'italic' }}>"{c.confession_text}"</p>

                                        <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: '#6b7280', marginBottom: '4px' }}>SENDER (PUJITH)</div>
                                                <div style={{ fontSize: '13px', fontWeight: 700 }}>{c.studentId?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.studentId?.email}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: '#6b7280', marginBottom: '4px' }}>RECIPIENT (MAANSA)</div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: c.target_student_email ? '#ea580c' : '#9ca3af' }}>
                                                    {c.target_student_email || 'GLOBAL BROADCAST'}
                                                </div>
                                                {c.target_student_email && <div style={{ fontSize: '11px', color: '#9ca3af' }}>Encrypted Direct Message</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#f9fafb', borderTop: '1px solid #f3f4f6', padding: '12px 24px', display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                                        <button 
                                            onClick={() => handleAction(c._id, 'approve')}
                                            style={{ background: '#ea580c', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                                        >
                                            APPROVE
                                        </button>
                                        <button 
                                            onClick={() => handleAction(c._id, 'reject')}
                                            style={{ background: 'transparent', color: '#4b5563', border: '1px solid #e5e5e5', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                                        >
                                            REJECT
                                        </button>
                                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 800 }}>AI RISK</div>
                                                <div style={{ fontSize: '14px', fontWeight: 800, color: c.aiSpamScore > 0.4 ? '#ef4444' : '#10b981' }}>{(c.aiSpamScore * 100).toFixed(0)}%</div>
                                            </div>
                                            <button 
                                                onClick={() => handleAction(c._id, 'delete')}
                                                style={{ background: 'transparent', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SIDEBAR - LIVE FEED */}
                <div>
                    <h3 style={{ margin: '0 0 24px 0', fontFamily: 'var(--uv-font-heading)', fontSize: '20px' }}>Public Activity <UvBadge status="answered" style={{ marginLeft: '8px' }}>LIVE</UvBadge></h3>
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {approved.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📻</div>
                                <p style={{ fontSize: '13px', color: '#6b7280' }}>Feed is currently silent.</p>
                            </div>
                        ) : (
                            approved.map((c) => (
                                <div key={c._id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: c.target_student_email ? '#9333ea' : '#ea580c' }}>
                                            {c.target_student_email ? 'PRIVATE KEY' : 'ANONYMOUS'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#4b5563', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        "{c.confession_text}"
                                    </p>
                                </div>
                            ))
                        )}
                        <UvButton variant="outline" style={{ fontSize: '12px' }} onClick={() => window.location.href='/dashboard/confessions'}>STUDENT INTERFACE ↗</UvButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
