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
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const DUMMY_RESOURCES = [
                {
                    _id: 'res1',
                    title: 'Data Structures and Algorithms - Fall 2023 Final',
                    content: 'Previous year question paper for CS201: Data Structures and Algorithms with solution key included.',
                    category: 'previous-year-papers',
                    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
                },
                {
                    _id: 'res2',
                    title: 'Operating Systems - Mid Sem 2024',
                    content: 'Mid semester examination paper for CS301: Operating Systems. Focuses on process synchronization and deadlocks.',
                    category: 'previous-year-papers',
                    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
                },
                {
                    _id: 'res3',
                    title: 'Database Management Systems - Spring 2024 Final',
                    content: 'Complete final examination paper for CS302: DBMS covering SQL, Normalization, and Transaction handling.',
                    category: 'previous-year-papers',
                    createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
                },
                {
                    _id: 'res4',
                    title: 'Computer Networks - Lab Manual & Viva Questions',
                    content: 'A comprehensive collection of lab exercises and frequently asked viva questions for the Computer Networks lab.',
                    category: 'previous-year-papers',
                    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
                }
            ];
            
            setMaterials(DUMMY_RESOURCES);
        } catch (err) { 
        } finally {
            setLoading(false);
        }
    }, []);

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
                                <a 
                                    href={m.fileUrl || "/dummy.pdf"} 
                                    download={`${m.title.replace(/\s+/g, '_')}.pdf`} 
                                    className="uv-btn" 
                                    style={{ flex: 1, fontSize: '11px', padding: '10px', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}
                                >
                                    DOWNLOAD PDF
                                </a>
                                <a 
                                    href={m.fileUrl || "/dummy.pdf"} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="uv-btn uv-btn-outline" 
                                    style={{ flex: 1, fontSize: '11px', padding: '10px', textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}
                                >
                                    VIEW ONLINE
                                </a>
                            </div>
                        </UvPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
