'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

const studentNavItems = [
    { href: '/dashboard', label: 'Overview', icon: '🏠' },
    { href: '/dashboard/doubts', label: 'Faculty Doubts', icon: '💬' },
    { href: '/dashboard/fest-updates', label: 'Fest Updates', icon: '🎉' },
    { href: '/dashboard/resources', label: 'Papers & Materials', icon: '📚' },
    { href: '/dashboard/daily-updates', label: 'Daily Updates', icon: '📢' },
    { href: '/dashboard/confessions', label: 'Confessions', icon: '🤫' },
];

export default function DashboardLayout({ children }) {
    const { user, loading, logout, isStudent } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/dashboard" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>CampusConnect</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    {studentNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>Student</span>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={logout} title="Logout">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className={styles.topbarTitle}>
                        {studentNavItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                    </div>
                    <div className={styles.topbarRight}>
                        <span className={styles.greeting}>
                            Hello, <strong>{user.name?.split(' ')[0]}</strong>
                        </span>
                    </div>
                </header>

                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
