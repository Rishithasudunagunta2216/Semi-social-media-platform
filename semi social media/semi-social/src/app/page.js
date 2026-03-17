'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <main className={styles.landing}>
      {/* Animated Background */}
      <div className={styles.bgGradient}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className={styles.logoText}>CampusConnect</span>
        </div>
        <nav className={styles.navLinks}>
          <button className="btn btn-secondary btn-sm" onClick={() => router.push('/login')}>
            Sign In
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/register')}>
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          University Exclusive Platform
        </div>
        <h1 className={styles.heroTitle}>
          Your Campus,<br />
          <span className={styles.heroGradient}>Connected.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          A structured, AI-moderated platform where students ask questions,
          access resources, and stay updated — all in one place.
        </p>
        <div className={styles.heroActions}>
          <button className="btn btn-primary btn-lg" onClick={() => router.push('/register')}>
            Join as Student
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => router.push('/login')}>
            Admin Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {[
            {
              icon: '💬',
              title: 'Ask Questions',
              desc: 'Post your doubts about faculty and courses. Get official answers from the admin team.',
              color: 'var(--primary)',
            },
            {
              icon: '🎉',
              title: 'Fest Updates',
              desc: 'Stay in the loop with all college fest announcements, schedules, and highlights.',
              color: 'var(--accent-amber)',
            },
            {
              icon: '📚',
              title: 'Resources Hub',
              desc: 'Access previous year papers, study materials, and important documents.',
              color: 'var(--accent-emerald)',
            },
            {
              icon: '📢',
              title: 'Daily Updates',
              desc: 'Get college and regional updates delivered fresh every day.',
              color: 'var(--accent-cyan)',
            },
            {
              icon: '🤫',
              title: 'Confessions',
              desc: 'Share anonymous confessions on Fridays. Admin-reviewed for a safe space.',
              color: 'var(--accent-violet)',
            },
            {
              icon: '🤖',
              title: 'AI Moderation',
              desc: 'Smart content analysis keeps the community clean and spam-free.',
              color: 'var(--accent-rose)',
            },
          ].map((feature, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featureIcon} style={{ background: `${feature.color}20`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 CampusConnect. Built for university communities.</p>
      </footer>
    </main>
  );
}
