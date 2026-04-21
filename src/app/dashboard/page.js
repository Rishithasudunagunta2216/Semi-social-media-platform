'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UvPanel, UvTag, UvButton } from '@/components/UvComponents';

const categories = [
    {
        id: 'doubts',
        title: 'ACADEMIC DOUBTS',
        desc: 'Official channel for faculty and course-related queries.',
        icon: '💬',
        href: '/dashboard/doubts',
        color: 'orange',
    },
    {
        id: 'fest',
        title: 'CAMPUS LIFE',
        desc: 'Real-time updates on college fests and community events.',
        icon: '🎉',
        href: '/dashboard/fest-updates',
        color: 'blue',
    },
    {
        id: 'resources',
        title: 'RESOURCES',
        desc: 'Centralized hub for papers, notes, and study materials.',
        icon: '📚',
        href: '/dashboard/resources',
        color: 'green',
    },
    {
        id: 'updates',
        title: 'DAILY NEWS',
        desc: 'Regional notices and local university announcements.',
        icon: '📢',
        href: '/dashboard/daily-updates',
        color: 'purple',
    },
];

export default function DashboardOverview() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* HERO SECTION SLIM */}
            <div style={{ background: 'linear-gradient(135deg, #181820 0%, #0e0e14 100%)', padding: '48px', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <UvTag color="orange" style={{ marginBottom: '16px' }}>STUDENT CONNECT</UvTag>
                    <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '32px', marginBottom: '12px' }}>Your Ecosystem is Active.</h1>
                    <p style={{ color: '#8a8a9a', maxWidth: '500px', lineHeight: 1.6 }}>Track your academic progress and stay synced with the university pulse. All systems are operational.</p>
                </div>
                <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'var(--uv-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }}></div>
            </div>

            {/* ACTION GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {categories.map((cat) => (
                    <UvPanel 
                        key={cat.id} 
                        title={<span style={{ fontSize: '13px' }}>{cat.title}</span>}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{cat.icon}</div>
                            <p style={{ color: 'var(--uv-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{cat.desc}</p>
                        </div>
                        <UvButton 
                            variant="outline" 
                            style={{ width: '100%', fontSize: '11px', padding: '8px' }}
                            onClick={() => router.push(cat.href)}
                        >
                            ACCESS MODULE
                        </UvButton>
                    </UvPanel>
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <UvPanel 
                title="SITUATION REPORT" 
                headerActions={<UvButton variant="outline" style={{ fontSize: '10px', padding: '6px 12px' }}>VIEW LOGS</UvButton>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { icon: '💬', text: "Academic query regarding 'Data Structures' has been resolved.", time: "2H AGO", color: 'orange' },
                        { icon: '🎉', text: "New announcement: 'Spring Fest 2026' volunteer registrations are open.", time: "5H AGO", color: 'blue' },
                        { icon: '📚', text: "Library Update: New set of 2025 question banks uploaded.", time: "1D AGO", color: 'green' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--uv-page-bg)', borderRadius: '12px', border: '1px solid var(--uv-border)' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid var(--uv-border)' }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.text}</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)', marginTop: '4px' }}>{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </UvPanel>
        </div>
    );
}
