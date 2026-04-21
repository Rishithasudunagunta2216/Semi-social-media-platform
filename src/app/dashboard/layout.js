'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const studentNavItems = [
    { href: '/dashboard', label: 'OVERVIEW', icon: '🏠' },
    { href: '/dashboard/doubts', label: 'MY DOUBTS', icon: '💬' },
    { href: '/dashboard/fest-updates', label: 'FEST UPDATES', icon: '🎉' },
    { href: '/dashboard/resources', label: 'RESOURCES', icon: '📚' },
    { href: '/dashboard/daily-updates', label: 'DAILY NEWS', icon: '📢' },
    { href: '/dashboard/confessions', label: 'CONFESSIONS', icon: '🤫' },
];

export default function DashboardLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
        if (!loading && user && user.role === 'admin') {
            router.replace('/admin');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e14' }}>
                <div className="uv-mono-sm" style={{ color: 'white' }}>AUTHENTICATING...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--uv-page-bg)' }}>
            {/* UNIVERA SIDEBAR (260px) */}
            <aside style={{ width: '260px', background: 'var(--uv-sidebar-bg)', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
                <div style={{ padding: '32px 24px' }}>
                    <div style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', background: 'var(--uv-primary)', borderRadius: '6px' }}></div>
                        UNIVERA
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '0 12px' }}>
                    <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)', paddingLeft: '12px', marginBottom: '16px', fontWeight: 600 }}>CAMPUS MODULES</div>
                    {studentNavItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                padding: '12px 14px', 
                                borderRadius: '10px', 
                                color: pathname === item.href ? 'white' : 'var(--uv-muted)', 
                                background: pathname === item.href ? 'rgba(232, 67, 10, 0.15)' : 'transparent',
                                textDecoration: 'none',
                                marginBottom: '4px',
                                transition: 'all 0.2s ease',
                                border: pathname === item.href ? '1px solid rgba(232, 67, 10, 0.2)' : '1px solid transparent'
                            }}
                            className={pathname === item.href ? '' : 'uv-nav-hover'}
                        >
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* USER CHIP / FOOTER */}
                <div style={{ padding: '24px', borderTop: '1px solid #1e1e26' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#181820', borderRadius: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--uv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                            {user.name?.charAt(0)}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)', fontSize: '9px' }}>STUDENT</div>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        style={{ width: '100%', background: 'transparent', border: '1px solid #2d2d3d', color: '#8a8a9a', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        SIGN OUT
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '40px 60px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div className="uv-mono-xs" style={{ color: 'var(--uv-primary)', fontWeight: 700, marginBottom: '8px' }}>
                            {studentNavItems.find(i => i.href === pathname)?.label || 'DASHBOARD'}
                        </div>
                        <h2 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '32px', fontWeight: 900, margin: 0 }}>
                            {pathname === '/dashboard' ? `Welcome back, ${user.name?.split(' ')[0]}!` : studentNavItems.find(i => i.href === pathname)?.label}
                        </h2>
                    </div>
                    <div style={{ color: 'var(--uv-muted)', fontSize: '14px', fontWeight: 500 }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                <div className="animate-fadeIn">
                    {children}
                </div>
            </main>

            <style jsx>{`
                .uv-nav-hover:hover {
                    color: white !important;
                    background: rgba(255,255,255,0.05) !important;
                }
                @keyframes uvFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: uvFadeIn 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}
