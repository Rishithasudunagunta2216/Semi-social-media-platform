'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvBadge, UvTag, UvButton, UvEmptyState, UvCard, UvLoading } from '@/components/UvComponents';

export default function ConfessionsPage() {
    const { authFetch } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModeEnabled, setIsModeEnabled] = useState(false);
    const [isFriday, setIsFriday] = useState(false);
    
    // Form State
    const [confessionText, setConfessionText] = useState('');
    const [targetEmail, setTargetEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // Tab State
    const [activeTab, setActiveTab] = useState('public'); 

    const checkAllowance = useCallback(async () => {
        try {
            const today = new Date();
            setIsFriday(today.getDay() === 5);
            const res = await authFetch('/api/admin/settings');
            const data = await res.json();
            if (res.ok) setIsModeEnabled(data.confessionMode);
        } catch (err) { }
    }, [authFetch]);

    const fetchConfessions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch(`/api/confessions?filter=${activeTab}`);
            const data = await res.json();
            if (res.ok) {
                setConfessions(data.confessions);
            } else {
                setError(data.error || 'Failed to fetch messages');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    }, [authFetch, activeTab]);

    useEffect(() => {
        checkAllowance();
    }, [checkAllowance]);

    useEffect(() => {
        fetchConfessions();
        const interval = setInterval(fetchConfessions, 60000); 
        return () => clearInterval(interval);
    }, [fetchConfessions]);

    // Handle input change to clear errors
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError('');
        if (message) setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!confessionText.trim()) return;

        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await authFetch('/api/confessions', {
                method: 'POST',
                body: JSON.stringify({ 
                    confession_text: confessionText.trim(),
                    target_student_email: targetEmail.trim() || null
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setConfessionText('');
                setTargetEmail('');
                setMessage(data.message);
                if (activeTab === 'my_sent') fetchConfessions();
            } else {
                // If there's an error details (from my forensics update), show it.
                setError(data.details ? `${data.error}: ${data.details}` : data.error);
            }
        } catch (err) {
            setError('Transmission failed. Check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const isAllowed = isFriday || isModeEnabled;

    return (
        <div className="uv-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '60px', alignItems: 'start' }}>
                
                {/* FEED COLUMN */}
                <div style={{ minWidth: 0 }}>
                    <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                        <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', letterSpacing: '4px', fontWeight: 800, marginBottom: '16px' }}>THE ANONYMOUS VOID</div>
                        <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '42px', color: '#1a1a1a', marginBottom: '32px' }}>Confessions</h1>
                        
                        {/* ELEGANT PILL TABS */}
                        <div style={{ 
                            display: 'inline-flex', 
                            gap: '4px', 
                            background: '#f8fafc', 
                            padding: '4px', 
                            borderRadius: '32px',
                            border: '1px solid #f1f5f9'
                        }}>
                            {[
                                { id: 'public', label: 'Public Feed' },
                                { id: 'for_me', label: 'Dedicated to Me' },
                                { id: 'my_sent', label: 'My Sent Secrets' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '10px 24px',
                                        background: activeTab === tab.id ? '#ffffff' : 'transparent',
                                        border: 'none',
                                        borderRadius: '24px',
                                        color: activeTab === tab.id ? '#ea580c' : '#64748b',
                                        fontWeight: 700,
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: activeTab === tab.id ? '0 4px 12px rgba(234, 88, 12, 0.08)' : 'none'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <UvLoading label="SYNCHRONIZING SECRETS..." />
                    ) : confessions.length === 0 ? (
                        <UvEmptyState 
                            icon={activeTab === 'for_me' ? '💬' : activeTab === 'my_sent' ? '📧' : '🌑'} 
                            title={activeTab === 'for_me' ? 'No Secrets Yet' : activeTab === 'my_sent' ? 'History Clear' : 'The Void is Silent'}
                            message={activeTab === 'for_me' ? "Nobody has sent you a private message in this cycle." : activeTab === 'my_sent' ? "You haven't transmitted any secrets to the void yet." : "There are no approved entries in the public feed right now."}
                        />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                            {confessions.map((c) => (
                                <UvCard key={c._id} padding="48px" style={{ textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                    <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                        <UvTag color={c.target_student_email ? 'purple' : 'orange'}>
                                            {c.target_student_email ? 'PRIVATE TARGET' : 'GENERAL BROADCAST'}
                                        </UvTag>
                                        <div className="uv-mono-xs" style={{ alignSelf: 'center', color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    
                                    <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#1e293b', fontStyle: 'italic', fontWeight: 500, margin: '0 auto 32px auto', maxWidth: '640px' }}>
                                        "{c.confession_text}"
                                    </p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '1px', background: '#f1f5f9' }}></div>
                                        <div className="uv-mono-xs" style={{ color: '#94a3b8', letterSpacing: '3px', fontWeight: 400 }}>END VERIFICATION</div>
                                        <div style={{ width: '40px', height: '1px', background: '#f1f5f9' }}></div>
                                    </div>
                                </UvCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* SUBMISSION SIDEBAR */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    <div style={{ 
                        background: '#ffffff', 
                        borderRadius: '24px', 
                        border: '1px solid #f1f5f9', 
                        padding: '36px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                    }}>
                        <div className="uv-mono-xs" style={{ color: '#94a3b8', marginBottom: '16px', textAlign: 'center', letterSpacing: '1px' }}>ENCRYPTING CHANNEL</div>
                        <h2 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '26px', textAlign: 'center', marginBottom: '40px' }}>Transmit Secret</h2>

                        {isAllowed ? (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>TARGET PEER EMAIL (OPTIONAL)</label>
                                    <input 
                                        type="email"
                                        placeholder="recipient@university.edu"
                                        value={targetEmail}
                                        onChange={handleInputChange(setTargetEmail)}
                                        style={{ 
                                            width: '100%', 
                                            padding: '16px 20px', 
                                            borderRadius: '16px', 
                                            border: '1.5px solid #f1f5f9', 
                                            fontSize: '14px', 
                                            outline: 'none',
                                            background: '#f8fafc',
                                            transition: '0.3s border-color, 0.3s box-shadow',
                                        }}
                                        className="elegant-input"
                                        disabled={submitting}
                                    />
                                </div>

                                <div style={{ marginBottom: '36px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>YOUR CONFESSION</label>
                                    <textarea 
                                        placeholder="Confess something anonymous..."
                                        value={confessionText}
                                        onChange={handleInputChange(setConfessionText)}
                                        disabled={submitting}
                                        style={{ 
                                            width: '100%',
                                            minHeight: '220px',
                                            padding: '20px',
                                            borderRadius: '16px', 
                                            border: '1.5px solid #f1f5f9', 
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            outline: 'none',
                                            background: '#f8fafc',
                                            resize: 'none',
                                            transition: '0.3s border-color, 0.3s box-shadow',
                                        }}
                                        className="elegant-input"
                                    />
                                </div>

                                {/* ELEGANT ERROR BOX */}
                                {error && (
                                    <div style={{ 
                                        color: '#b91c1c', 
                                        marginBottom: '32px', 
                                        padding: '16px', 
                                        background: '#fff1f2', 
                                        borderRadius: '16px', 
                                        border: '1px solid #fecaca', 
                                        fontSize: '13px', 
                                        fontWeight: 600,
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center',
                                        animation: 'fadeIn 0.3s forwards'
                                    }}>
                                        <div style={{ width: '18px', minWidth: '18px', height: '18px', borderRadius: '50%', background: '#f43f5e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>!</div>
                                        <div>{error}</div>
                                    </div>
                                )}

                                {message && (
                                    <div style={{ 
                                        color: '#047857', 
                                        marginBottom: '32px', 
                                        padding: '16px', 
                                        background: '#f0fdf4', 
                                        borderRadius: '16px', 
                                        border: '1px solid #dcfce7', 
                                        fontSize: '13px', 
                                        fontWeight: 600,
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ width: '18px', minWidth: '18px', height: '18px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                                        <div>{message}</div>
                                    </div>
                                )}
                                
                                <UvButton 
                                    type="submit" 
                                    disabled={submitting || !confessionText.trim()}
                                    style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '14px', letterSpacing: '1px' }}
                                >
                                    {submitting ? 'TRANSMITTING...' : 'SEND TO VOID'}
                                </UvButton>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.5 }}>🔒</div>
                                <div style={{ fontWeight: 800, color: '#475569', marginBottom: '8px' }}>VOID CLOSED</div>
                                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Protocol resumes on Friday.</p>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '36px', padding: '28px', borderTop: '2px solid #f8fafc' }}>
                        <div style={{ fontWeight: 800, fontSize: '11px', color: '#cbd5e1', marginBottom: '20px', letterSpacing: '1.5px' }}>SECURITY PROTOCOLS</div>
                        <ul style={{ fontSize: '12px', color: '#94a3b8', paddingLeft: '0', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#ea580c' }}>⊕</span> 
                                <span>End-to-end identity encryption.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#ea580c' }}>⊕</span> 
                                <span>Real-time AI moderation active.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#ea580c' }}>⊕</span> 
                                <span>Private targeting is restricted.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .elegant-input:focus {
                    border-color: #ea580c !important;
                    box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.05);
                    background: #ffffff !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
