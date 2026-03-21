'use client';

import Link from 'next/link';
import { UvButton, UvTag } from '@/components/UvComponents';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--uv-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <div style={{ maxWidth: '440px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <UvTag color="orange">ERROR CODE: 404</UvTag>
                </div>
                <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
                    Lost in <span style={{ color: 'var(--uv-primary)' }}>Space.</span>
                </h1>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--uv-muted)', marginBottom: '40px' }}>
                    The resource you are attempting to access has been deindexed or relocated within the Univera ecosystem.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <UvButton style={{ padding: '14px 32px' }}>RETURN TO PUBLIC GATEWAY</UvButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
