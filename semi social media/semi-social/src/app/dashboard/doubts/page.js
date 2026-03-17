'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '../dashboard.module.css';

export default function DoubtsPage() {
    const { authFetch, user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionText, setQuestionText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/questions?category=doubts-about-faculty');
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
                    category: 'doubts-about-faculty',
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
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Faculty Doubts</h1>
                    <p className="text-muted">Ask questions about courses, faculty, and academic concerns.</p>
                </div>
            </div>

            <div className="card card-glass mb-10">
                <h3 className="text-lg font-bold mb-4">Ask a Question</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <textarea
                            className="input-field"
                            placeholder="Type your question here..."
                            rows="3"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            disabled={submitting}
                        />
                    </div>
                    {error && <div className="text-accent-rose text-sm font-medium">{error}</div>}
                    {message && <div className="text-accent-emerald text-sm font-medium">{message}</div>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || !questionText.trim()}
                        >
                            {submitting ? 'Submitting...' : 'Post Question'}
                        </button>
                    </div>
                </form>
            </div>

            <h3 className="text-xl font-bold mb-6">Recent Questions</h3>

            {loading ? (
                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card skeleton h-32 w-full"></div>
                    ))}
                </div>
            ) : questions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <div className="empty-title">No questions yet</div>
                    <p className="empty-desc">Be the first to ask a question! All students can see your question, but only admin can answer.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {questions.map((q) => (
                        <div key={q._id} className="card border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-glow flex items-center justify-center text-xs font-bold text-primary">
                                        {q.studentId?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{q.studentId?.name || 'Anonymous Student'}</p>
                                        <p className="text-xs text-muted">{new Date(q.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {!q.isApproved && <span className="badge badge-warning">Pending Review</span>}
                            </div>

                            <div className="mb-6">
                                <p className="text-text-primary whitespace-pre-wrap">{q.questionText}</p>
                            </div>

                            {q.answers && q.answers.length > 0 ? (
                                <div className="mt-4 p-4 rounded-lg bg-bg-secondary border border-subtle">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-primary">Admin Answer</span>
                                        <span className="text-xs text-muted">
                                            {new Date(q.answers[0].createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary">{q.answers[0].answerText}</p>
                                </div>
                            ) : (
                                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Waiting for admin response...
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
