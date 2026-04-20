'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton } from '@/components/UvComponents';

export default function FestUpdatesPage() {
    const { authFetch } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            // Simulated network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const DUMMY_FEST_UPDATES = [
                {
                    _id: 'fest1',
                    title: 'Spring Fest 2026 Headliner Announced!',
                    content: 'We are thrilled to announce that the headliner for Spring Fest 2026 will be none other than The Midnight! Get ready for an electrifying night of synthwave. Tickets go on sale next week.',
                    category: 'fest-updates',
                    isPinned: true,
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    _id: 'fest2',
                    title: 'Hackathon Registration Now Open',
                    content: 'The annual 48-hour campus hackathon is back! Form a team of up to 4 members and build something amazing. First prize is $5000. Check your campus email for registration details.',
                    category: 'fest-updates',
                    isPinned: false,
                    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
                },
                {
                    _id: 'fest3',
                    title: 'Call for Volunteers: Cultural Night',
                    content: 'We need enthusiastic volunteers to help organize and manage the upcoming Cultural Night. Roles available in stage management, hospitality, and crowd control. Add it to your resume!',
                    category: 'fest-updates',
                    isPinned: false,
                    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ];
            
            setPosts(DUMMY_FEST_UPDATES);
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="uv-page">
            {loading ? (
                <div className="uv-mono-sm">LOADING CAMPUS NEWS...</div>
            ) : error ? (
                <div style={{ padding: '24px', background: 'rgba(232, 67, 10, 0.05)', borderRadius: '12px', border: '1px solid rgba(232, 67, 10, 0.1)', color: 'var(--uv-primary)', fontSize: '14px' }}>
                    {error.toUpperCase()}
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '14px', border: '1px solid var(--uv-border)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎭</div>
                    <div className="uv-mono-sm">NO UPDATES YET</div>
                    <p style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>Festivities are currently in the planning phase. Check back shortly.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                    {posts.map((post) => (
                        <UvPanel 
                            key={post._id} 
                            title={<UvTag color="blue">FESTIVAL UPDATE</UvTag>}
                            headerActions={
                                post.isPinned && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--uv-primary)', fontWeight: 800 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 9V4l1 0V2H7v2l1 0v5L6 12v2h5v7l1 1 1-1v-7h5v-2l-2-3z" />
                                        </svg>
                                        <span className="uv-mono-xs">PINNED</span>
                                    </div>
                                )
                            }
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '22px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>{post.title}</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--uv-muted)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--uv-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--uv-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px' }}>A</div>
                                    <span className="uv-mono-xs" style={{ fontWeight: 600 }}>ADMINISTRATION</span>
                                </div>
                                <span className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
