'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UvButton, UvTag } from '@/components/UvComponents';

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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--uv-page-bg)' }}>
        <div className="uv-mono-sm">INITIALIZING UNIVERA...</div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--uv-page-bg)', color: '#1a1a1a', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* NAVIGATION */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '24px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--uv-primary)', borderRadius: '8px' }}></div>
          UNIVERA
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className="header-btn-light"
            onClick={() => router.push('/login')}
          >
            LOG IN
          </button>
          <button 
            className="header-btn-primary"
            onClick={() => router.push('/register')}
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 16px', 
            background: '#ffedd5', 
            color: '#ea580c', 
            fontSize: '11px', 
            fontWeight: 800, 
            letterSpacing: '0.1em', 
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            UNIVERSITY EXCLUSIVE
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 32px' }}>
          Your Campus,<br />
          <span style={{ color: 'var(--uv-primary)' }}>Reimagined.</span>
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '18px', lineHeight: 1.6, color: 'var(--uv-muted)', margin: '0 0 48px' }}>
          A premium, AI-moderated ecosystem for the modern student. Ask questions, access resources, and stay connected with your university community.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className="hero-btn-primary"
            onClick={() => router.push('/register')}
          >
            JOIN THE COMMUNITY
          </button>
          <button 
            className="hero-btn-light"
            onClick={() => router.push('/login?role=admin')}
          >
            ADMIN ACCESS
          </button>
        </div>
      </section>

      <style jsx>{`
        button {
          transition: all 0.2s ease;
          border-radius: 8px;
          cursor: pointer;
        }
        
        button:hover {
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }

        /* Outline / Light Buttons */
        .header-btn-light {
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 700;
          background: #f9f9f9;
          color: #1a1a1a;
          border: 1px solid #e5e5e5;
        }

        .header-btn-light:hover {
          background: #f0f0f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .hero-btn-light {
          padding: 16px 40px;
          font-size: 14px;
          font-weight: 700;
          background: #f9f9f9;
          color: #1a1a1a;
          border: 1px solid #e5e5e5;
        }

        .hero-btn-light:hover {
          background: #f0f0f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Primary Solid Action Buttons */
        .header-btn-primary {
          padding: 10px 24px;
          font-size: 12px;
          font-weight: 700;
          background: var(--uv-primary);
          color: white;
          border: none;
        }

        .header-btn-primary:hover {
          background: #d83a06; /* slightly darker orange */
          box-shadow: 0 4px 16px rgba(232, 67, 10, 0.25);
        }

        .hero-btn-primary {
          padding: 16px 40px;
          font-size: 14px;
          font-weight: 700;
          background: var(--uv-primary);
          color: white;
          border: none;
        }

        .hero-btn-primary:hover {
          background: #d83a06;
          box-shadow: 0 4px 16px rgba(232, 67, 10, 0.25);
        }
      `}</style>
    </main>
  );
}
