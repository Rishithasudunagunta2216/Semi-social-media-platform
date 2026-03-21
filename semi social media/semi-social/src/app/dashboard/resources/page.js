'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvInput } from '@/components/UvComponents';

export default function ResourcesPage() {
    const { authFetch } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch('/api/posts?category=previous-year-papers');
            const data = await res.json();
            if (res.ok) {
                setMaterials(data.posts);
            }
        } catch (err) { } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const filteredMaterials = materials.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="uv-page">
            <div style={{ marginBottom: '40px', maxWidth: '500px' }}>
                <UvInput 
                    placeholder="SEARCH REPOSITORY (E.G. DATA STRUCTURES)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="uv-mono-sm">INDEXING ACADEMIC ASSETS...</div>
            ) : filteredMaterials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '14px', border: '1px solid var(--uv-border)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📚</div>
                    <div className="uv-mono-sm">NULL SEARCH RESULTS</div>
                    <p style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>No academic materials match your query. Try broader keywords.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filteredMaterials.map((m) => (
                        <UvPanel 
                            key={m._id} 
                            title={<UvTag color="green">ACADEMIC ASSET</UvTag>}
                            headerActions={<div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>ID: {m._id.slice(-6).toUpperCase()}</div>}
                        >
                            <div style={{ marginBottom: '24px', minHeight: '80px' }}>
                                <h3 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{m.title}</h3>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>PUBLISHED: {new Date(m.createdAt).toLocaleDateString()}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: '1px solid var(--uv-border)' }}>
                                <UvButton variant="primary" style={{ flex: 1, fontSize: '11px', padding: '10px' }}>
                                    DOWNLOAD PDF
                                </UvButton>
                                <UvButton variant="outline" style={{ flex: 1, fontSize: '11px', padding: '10px' }}>
                                    VIEW ONLINE
                                </UvButton>
                            </div>
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
