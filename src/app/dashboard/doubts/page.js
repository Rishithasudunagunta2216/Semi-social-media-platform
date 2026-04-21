'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvTextarea } from '@/components/UvComponents';

export default function DoubtsPage() {
    const { authFetch, user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionText, setQuestionText] = useState('');
    const [category, setCategory] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/questions?category=all');
            const data = await res.json();
            if (res.ok) {
                setQuestions(data.questions);
            } else {
                setError(data.error || 'Failed to fetch questions');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;

        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await authFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({
                    questionText: questionText.trim(),
                    category: category,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setQuestionText('');
                setMessage(data.message);
                fetchQuestions();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to submit question');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="uv-page">
            <UvPanel title="Submit Enquiry" style={{ marginBottom: '48px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="uv-mono-xs" style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--uv-muted)', letterSpacing: '0.05em' }}>CATEGORY</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', paddingRight: '40px', borderRadius: '12px', border: '1px solid var(--uv-border)', background: 'var(--uv-page-bg)', fontSize: '14px', color: category === '' ? 'var(--uv-muted)' : '#1a1a1a', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Academics">Academics</option>
                                <option value="Attendance">Attendance</option>
                                <option value="Campus">Campus</option>
                                <option value="Events">Events</option>
                                <option value="Exams">Exams</option>
                                <option value="Faculty">Faculty</option>
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--uv-muted)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <UvTextarea 
                        label="YOUR QUESTION"
                        placeholder="What's on your mind? Select a category above..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        disabled={submitting}
                        style={{ marginBottom: '20px' }}
                    />
                    {error && <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', marginBottom: '16px' }}>ERROR: {error.toUpperCase()}</div>}
                    {message && <div className="uv-mono-xs" style={{ color: 'var(--uv-green)', marginBottom: '16px' }}>SUCCESS: {message.toUpperCase()}</div>}
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <UvButton 
                            type="submit" 
                            disabled={submitting || !questionText.trim()}
                            style={{ padding: '12px 32px' }}
                        >
                            {submitting ? 'TRANSMITTING...' : 'POST ENQUIRY'}
                        </UvButton>
                    </div>
                </form>
            </UvPanel>

            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ height: '1px', flex: 1, background: 'var(--uv-border)' }}></div>
                <div className="uv-mono-xs" style={{ fontWeight: 800, color: 'var(--uv-muted)' }}>RECENT CAMPUS ENQUIRIES</div>
                <div style={{ height: '1px', flex: 1, background: 'var(--uv-border)' }}></div>
            </div>

            {loading ? (
                <div className="uv-mono-sm">RETRIVING FEED...</div>
            ) : questions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px', border: '1px solid var(--uv-border)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                    <div className="uv-mono-sm">INBOX EMPTY</div>
                    <p style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>Be the first to initiate an academic enquiry.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {questions.map((q) => (
                        <UvPanel 
                            key={q._id} 
                            title={
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <UvTag color="blue">{q.studentId?.name || 'STUDENT'}</UvTag>
                                    <UvTag color="orange" style={{ textTransform: 'uppercase' }}>{q.category}</UvTag>
                                </div>
                            }
                            headerActions={<div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}</div>}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#1a1a1a', fontWeight: 500 }}>{q.questionText}</p>
                            </div>

                            {q.answers && q.answers.length > 0 ? (
                                <div style={{ background: 'var(--uv-page-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--uv-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <UvBadge status="answered">OFFICIAL RESPONSE</UvBadge>
                                        <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>ADMINISTRATION</div>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--uv-muted)' }}>{q.answers[0].answerText}</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <UvBadge status="pending">PENDING VERIFICATION</UvBadge>
                                    <span className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>WAITING FOR REVIEW</span>
                                </div>
                            )}
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
