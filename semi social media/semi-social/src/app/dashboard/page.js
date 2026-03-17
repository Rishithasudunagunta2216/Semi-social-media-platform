'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

const categories = [
    {
        id: 'doubts',
        title: 'Faculty Doubts',
        desc: 'Ask questions and get answers from the admin team.',
        icon: '💬',
        href: '/dashboard/doubts',
        color: 'var(--primary)',
    },
    {
        id: 'fest',
        title: 'Fest Updates',
        desc: 'Stay informed about all college fests and events.',
        icon: '🎉',
        href: '/dashboard/fest-updates',
        color: 'var(--accent-amber)',
    },
    {
        id: 'resources',
        title: 'Materials & Papers',
        desc: 'Previous year papers and study materials hub.',
        icon: '📚',
        href: '/dashboard/resources',
        color: 'var(--accent-emerald)',
    },
    {
        id: 'updates',
        title: 'Daily Updates',
        desc: 'Daily college and regional news and notices.',
        icon: '📢',
        href: '/dashboard/daily-updates',
        color: 'var(--accent-cyan)',
    },
    {
        id: 'confessions',
        title: 'Confessions',
        desc: 'Share and view anonymous student confessions.',
        icon: '🤫',
        href: '/dashboard/confessions',
        color: 'var(--accent-violet)',
    },
];

export default function DashboardOverview() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div className="animate-fadeIn">
            <div className={styles.welcomeSection}>
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-muted">Explore your campus hub and stay updated with everything happening at [University Name].</p>
            </div>

            <div className="grid-cards mt-8">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="card card-glass cursor-pointer hover:scale-105 transition-all"
                        onClick={() => router.push(cat.href)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                            style={{ background: `${cat.color}20`, color: cat.color, fontSize: '1.5rem' }}
                        >
                            {cat.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
                        <p className="text-sm text-muted mb-4">{cat.desc}</p>
                        <div className="flex items-center text-primary-light text-sm font-semibold">
                            Explore
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-card rounded-xl p-8 border border-subtle">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Quick Activity</h2>
                    <button className="btn btn-secondary btn-sm">View All</button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-bg-secondary border border-subtle">
                        <div className="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center text-primary">💬</div>
                        <div>
                            <p className="text-sm font-semibold">Your question about 'Faculty Feedback' was answered</p>
                            <p className="text-xs text-muted">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-bg-secondary border border-subtle">
                        <div className="w-10 h-10 rounded-full bg-accent-amber style={{ background: 'rgba(245, 158, 11, 0.1)' }} flex items-center justify-center text-accent-amber">🎉</div>
                        <div>
                            <p className="text-sm font-semibold">Admin posted: 'TechFest 2026 Schedule Released'</p>
                            <p className="text-xs text-muted">5 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
