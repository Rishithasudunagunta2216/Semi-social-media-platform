'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UvBadge } from '@/components/UvComponents';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/questions', label: 'Student Doubts', icon: '💬' },
    { href: '/admin/posts', label: 'Daily Updates', icon: '📢' },
    { href: '/admin/confessions', label: 'Confessions', icon: '🤫' },
    { href: '/admin/users', label: 'Students', icon: '👥' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
        if (!loading && user && user.role !== 'admin') router.replace('/dashboard');
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="uv-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="uv-mono-sm">LOADING ASSETS...</div>
            </div>
        );
    }

    return (
        <div className="univera-shell">
            {/* BLOCK 01 — SIDEBAR */}
            <aside className="uv-sidebar">
                <div className="uv-sidebar-brand">
                    <div className="uv-logo-mark">U</div>
                    <span className="uv-wordmark">Univer<span>a</span></span>
                </div>

                <nav className="uv-sidebar-nav">
                    <div className="uv-nav-section">ADMINISTRATION</div>
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`uv-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                            {item.label === 'Student Doubts' && (
                                <div style={{ marginLeft: 'auto', background: '#3b82f6', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>2</div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="uv-sidebar-footer">
                    <div className="uv-user-chip">
                        <div className="uv-avatar">{user.name?.charAt(0) || 'A'}</div>
                        <div className="uv-user-info">
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{user.name}</div>
                            <div className="uv-user-role">Super Admin</div>
                        </div>
                    </div>
                    <button 
                        onClick={logout} 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
                    >
                        🚪
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="univera-main">
                {/* Internal Page Header (Automated) */}
                <header className="uv-page-header">
                    <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', marginBottom: '4px', fontWeight: 600 }}>ADMIN COMMAND CENTRE</div>
                    <h1>{adminNavItems.find(item => item.href === pathname)?.label || 'System'}</h1>
                </header>

                <div className="uv-page">
                    {children}
                </div>
            </main>

            <style jsx>{`
                .univera-shell {
                    display: flex;
                    min-height: 100vh;
                    background: #f5f4ef;
                }
                .uv-sidebar {
                    width: 260px;
                    background: #ffffff;
                    border-right: 1px solid #e5e5e5;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    padding: 32px 0;
                    color: #111827;
                    flex-shrink: 0;
                }
                .uv-sidebar-brand {
                    padding: 0 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 48px;
                }
                .uv-logo-mark {
                    width: 36px;
                    height: 36px;
                    background: #ea580c;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--uv-font-heading);
                    font-weight: 900;
                    font-size: 20px;
                    color: white;
                }
                .uv-wordmark {
                    font-family: var(--uv-font-heading);
                    font-size: 24px;
                    font-weight: 900;
                }
                .uv-wordmark span { color: #ea580c; }
                .uv-sidebar-nav { flex: 1; padding: 0 12px; }
                .uv-nav-section {
                    padding: 0 12px;
                    margin: 24px 0 12px 0;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #9ca3af;
                    font-family: system-ui, -apple-system, sans-serif;
                    letter-spacing: 0.1em;
                }
                .uv-nav-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    color: #4b5563;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 8px;
                    gap: 12px;
                    transition: 0.2s;
                    margin-bottom: 4px;
                    border: 1px solid transparent;
                }
                .uv-nav-item:hover { background: #f9fafb; color: #111827; }
                .uv-nav-item.active { background: #ffedd5; color: #c2410c; border: 1px solid #ea580c; font-weight: 700; }
                .uv-sidebar-footer {
                    padding: 24px 16px;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .uv-user-chip { display: flex; align-items: center; gap: 10px; }
                .uv-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #ea580c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                    font-size: 14px;
                }
                .uv-user-role { font-size: 11px; color: #6b7280; font-weight: 600; }
                .univera-main {
                    flex: 1;
                    padding: 36px 40px;
                    overflow-y: auto;
                }
                .uv-page-header {
                    margin-bottom: 32px;
                }
                .uv-page-header h1 {
                    font-family: var(--uv-font-heading);
                    font-size: 32px;
                    font-weight: 900;
                    color: #111827;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
