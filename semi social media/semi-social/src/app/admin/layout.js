'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../dashboard/dashboard.module.css';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/questions', label: 'Moderation', icon: '🛡️' },
    { href: '/admin/posts', label: 'Content Management', icon: '✍️' },
    { href: '/admin/confessions', label: 'Review Confessions', icon: '🤫' },
    { href: '/admin/users', label: 'User Control', icon: '👥' },
    { href: '/admin/settings', label: 'System Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
        if (!loading && user && user.role !== 'admin') {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.dashLayout}>
            {/* Mobile overlay */}
            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`} style={{ borderRightColor: 'var(--accent-rose)', borderRightWidth: '2px' }}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        <div className={styles.logoIcon} style={{ background: 'linear-gradient(135deg, var(--accent-rose) 0%, #dc2626 100%)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>Admin Panel</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                            style={pathname === item.href ? { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' } : {}}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar} style={{ background: 'var(--accent-rose)' }}>
                            A
                        </div>
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>Super Admin</span>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={logout} title="Logout">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={styles.mainWrapper}>
                {/* Top Bar */}
                <header className={styles.topbar}>
                    <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className={styles.topbarTitle}>
                        {adminNavItems.find(item => item.href === pathname)?.label || 'Admin Management'}
                    </div>
                    <div className={styles.topbarRight}>
                        <div className="flex items-center gap-4">
                            <span className="badge badge-danger">Live Moderation Active</span>
                            <Link href="/dashboard" target="_blank" className="btn btn-secondary btn-sm">
                                View Site ↗
                            </Link>
                        </div>
                    </div>
                </header>

                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
