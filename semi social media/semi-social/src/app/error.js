'use client';

import { useEffect } from 'react';
import { UvButton, UvTag } from '@/components/UvComponents';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--uv-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <div style={{ maxWidth: '440px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <UvTag color="red">CRITICAL SYSTEM ERROR</UvTag>
                </div>
                <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
                    Signal <span style={{ color: 'var(--uv-primary)' }}>Interrupted.</span>
                </h1>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--uv-muted)', marginBottom: '40px' }}>
                    A technical anomaly has occurred. Our engineers are monitoring the situation.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <UvButton style={{ padding: '14px 32px' }} onClick={reset}>REBOOT INTERFACE</UvButton>
                </div>
                <div className="uv-mono-xs" style={{ marginTop: '32px', color: 'var(--uv-muted)', opacity: 0.5 }}>
                    ID: {error.message || 'UNKNOWN_EXCEPTION'}
                </div>
            </div>
        </div>
    );
}
