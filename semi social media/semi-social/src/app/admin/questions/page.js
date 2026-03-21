'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvBadge, UvTag, UvButton, UvTextarea } from '@/components/UvComponents';

export default function ModerationPage() {
    const { authFetch } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, answered

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all questions for admin to see
            const res = await authFetch('/api/questions?category=all&limit=50');
            const data = await res.json();
            if (res.ok) {
                setQuestions(data.questions);
            }
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAction = async (id, action, body = {}) => {
        try {
            if (action === 'post') setSubmitting(true);
            const res = await authFetch(`/api/questions/${id}`, action === 'delete' ? { method: 'DELETE' } : action === 'patch' ? { method: 'PATCH', body: JSON.stringify(body) } : { method: 'POST', body: JSON.stringify(body) });
            if (res.ok) {
                if (action === 'delete') {
                    setQuestions(questions.filter(q => q._id !== id));
                } else {
                    fetchQuestions();
                }
                if (action === 'post') {
                    setReplyId(null);
                    setReplyText('');
                }
            }
        } catch (e) { } finally {
            if (action === 'post') setSubmitting(false);
        }
    };

    // Filter Logic
    const filteredQuestions = questions.filter(q => {
        if (filter === 'pending') return !q.answers || q.answers.length === 0;
        if (filter === 'answered') return q.answers && q.answers.length > 0;
        return true;
    });

    const pendingCount = questions.filter(q => !q.answers || q.answers.length === 0).length;

    const getTimeAgo = (dateStr) => {
        const diff = new Date() - new Date(dateStr);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours === 1) return '1 hour ago';
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    return (
        <div>
            <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '-24px', marginBottom: '32px' }}>Review and reply to student questions</p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: '#ffffff', padding: '6px', borderRadius: '12px', width: 'fit-content', border: '1px solid #e5e5e5' }}>
                <button 
                    onClick={() => setFilter('all')}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filter === 'all' ? '#ffedd5' : 'transparent', color: filter === 'all' ? '#ea580c' : '#6b7280', fontWeight: filter === 'all' ? 700 : 500, cursor: 'pointer', fontSize: '13px', transition: '0.2s' }}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('pending')}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filter === 'pending' ? '#ffedd5' : 'transparent', color: filter === 'pending' ? '#ea580c' : '#6b7280', fontWeight: filter === 'pending' ? 700 : 500, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                >
                    Pending
                    {pendingCount > 0 && (
                        <div style={{ background: filter === 'pending' ? '#ea580c' : '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                            {pendingCount}
                        </div>
                    )}
                </button>
                <button 
                    onClick={() => setFilter('answered')}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filter === 'answered' ? '#ffedd5' : 'transparent', color: filter === 'answered' ? '#ea580c' : '#6b7280', fontWeight: filter === 'answered' ? 700 : 500, cursor: 'pointer', fontSize: '13px', transition: '0.2s' }}
                >
                    Answered
                </button>
            </div>

            {loading ? (
                <div className="uv-mono-sm" style={{ padding: '40px 0', color: '#6b7280' }}>RETRIEVING QUEUE...</div>
            ) : filteredQuestions.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
                    <h2 style={{ fontFamily: 'var(--uv-font-heading)', marginBottom: '12px', fontSize: '24px', color: '#111827' }}>You're all caught up!</h2>
                    <p style={{ color: '#6b7280' }}>No questions match your current filter.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredQuestions.map((q) => {
                        const isAnswered = q.answers && q.answers.length > 0;
                        return (
                            <div key={q._id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                {/* Card Header */}
                                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                                            {q.studentId?.name?.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{q.studentId?.name || 'Anonymous Student'}</div>
                                        <div style={{ padding: '4px 10px', background: '#f3f4f6', color: '#4b5563', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {q.category}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                                            {getTimeAgo(q.createdAt)}
                                        </div>
                                    </div>
                                    <div>
                                        {isAnswered ? (
                                            <div style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', border: '1px solid #bbf7d0' }}>ANSWERED</div>
                                        ) : (
                                            <div style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', border: '1px solid #fde68a' }}>PENDING</div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '0 24px 24px' }}>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1f2937', margin: 0 }}>{q.questionText}</p>
                                </div>

                                {/* Card Footer & Actions */}
                                <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px 24px', background: '#f9fafb', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {isAnswered && replyId !== q._id && (
                                        <div style={{ width: '100%', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e5e5', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 800, letterSpacing: '0.05em' }}>OFFICIAL RESPONSE</div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{q.answers[0].adminId?.name || 'Admin'}</div>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{q.answers[0].answerText}</p>
                                        </div>
                                    )}

                                    {replyId === q._id ? (
                                        <div style={{ width: '100%' }} className="animate-fadeIn">
                                            <UvTextarea 
                                                placeholder="Type your official response here..."
                                                rows="3"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '16px' }}>
                                                <button 
                                                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ea580c', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                                                    onClick={() => handleAction(q._id, 'post', { answerText: replyText })}
                                                    disabled={!replyText.trim() || submitting}
                                                >
                                                    {submitting ? 'POSTING...' : 'Submit Reply'}
                                                </button>
                                                <button 
                                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#ffffff', color: '#4b5563', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                                                    onClick={() => setReplyId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#ffffff', color: '#4b5563', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                onClick={() => setReplyId(q._id)}
                                            >
                                                ↩ {isAnswered ? 'Edit Reply' : 'Reply'}
                                            </button>
                                            {!q.isApproved && (
                                                <button 
                                                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ea580c', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                                                    onClick={() => handleAction(q._id, 'patch', { isApproved: true, isFlagged: false })}
                                                >
                                                    Approve & Publish
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
