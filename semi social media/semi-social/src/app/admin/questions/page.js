'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

export default function ModerationPage() {
    const { authFetch } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('all'); // all, flagged, pending

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            let url = '/api/questions?category=doubts-about-faculty&limit=50';
            if (filter === 'flagged') url += '&flagged=true';
            const res = await authFetch(url);
            const data = await res.json();
            if (res.ok) {
                setQuestions(data.questions);
            }
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch, filter]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAction = async (id, action, body = {}) => {
        try {
            const res = await authFetch(`/api/questions/${id}`, {
                method: action === 'delete' ? 'DELETE' : action === 'patch' ? 'PATCH' : 'POST',
                body: Object.keys(body).length ? JSON.stringify(body) : undefined,
            });
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
        } catch (e) { }
    };

    const getScoreColor = (score) => {
        if (score >= 0.7) return 'var(--accent-rose)';
        if (score >= 0.4) return 'var(--accent-amber)';
        return 'var(--accent-emerald)';
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Doubt Moderation</h1>
                    <p className="text-muted">Review student questions, provide answers, and manage community content.</p>
                </div>
                <div className="tab-nav">
                    <button className={`tab-item ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`tab-item ${filter === 'flagged' ? 'active' : ''}`} onClick={() => setFilter('flagged')}>Flagged</button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="card skeleton h-40"></div>)}
                </div>
            ) : questions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛡️</div>
                    <div className="empty-title">Queue is clear</div>
                    <p className="empty-desc">No questions matching your current filter.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {questions.map((q) => (
                        <div key={q._id} className={`card ${q.isFlagged ? 'border-l-4 border-l-accent-rose' : 'border-l-4 border-l-primary'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold">
                                        {q.studentId?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{q.studentId?.name}</h4>
                                        <p className="text-xs text-muted">{q.studentId?.registrationNumber} • {new Date(q.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted uppercase">AI Score</span>
                                        <div className="spam-bar w-24">
                                            <div
                                                className="spam-bar-fill"
                                                style={{ width: `${q.aiSpamScore * 100}%`, backgroundColor: getScoreColor(q.aiSpamScore) }}
                                            ></div>
                                        </div>
                                    </div>
                                    {q.isFlagged && <span className="badge badge-danger">High Risk</span>}
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-bg-secondary rounded-lg border border-subtle">
                                <p className="text-sm italic text-muted mb-2">Student asked:</p>
                                <p className="text-text-primary">{q.questionText}</p>
                            </div>

                            {q.aiAnalysis?.reasoning && q.isFlagged && (
                                <div className="mb-6 p-3 rounded-lg bg-accent-rose bg-opacity-10 border border-accent-rose border-opacity-20 text-xs text-accent-rose">
                                    <strong>AI Analysis:</strong> {q.aiAnalysis.reasoning}
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button className="btn btn-primary btn-sm" onClick={() => setReplyId(q._id)}>
                                        {q.answers?.length > 0 ? 'Edit Answer' : 'Answer Question'}
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleAction(q._id, 'delete')}>
                                        Delete
                                    </button>
                                </div>
                                {!q.isApproved && (
                                    <button className="btn btn-success btn-sm" onClick={() => handleAction(q._id, 'patch', { isApproved: true, isFlagged: false })}>
                                        Approve
                                    </button>
                                )}
                            </div>

                            {replyId === q._id && (
                                <div className="mt-6 animate-fadeIn">
                                    <div className="input-group">
                                        <label>Official Answer</label>
                                        <textarea
                                            className="input-field"
                                            rows="4"
                                            placeholder="Type your official response..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button className="btn btn-secondary btn-sm" onClick={() => setReplyId(null)}>Cancel</button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAction(q._id, 'post', { answerText: replyText })}
                                            disabled={!replyText.trim() || submitting}
                                        >
                                            Post Answer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {q.answers?.length > 0 && replyId !== q._id && (
                                <div className="mt-6 p-4 rounded-lg bg-primary-glow border border-primary border-opacity-20">
                                    <p className="text-xs font-bold text-primary-light uppercase mb-2">Your Answer:</p>
                                    <p className="text-sm text-text-secondary">{q.answers[0].answerText}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
