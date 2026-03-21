'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvInput } from '@/components/UvComponents';

export default function SettingsPage() {
    const { authFetch } = useAuth();
    const [settings, setSettings] = useState({
        confessionMode: false,
        registrationClosed: false,
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await authFetch('/api/admin/settings');
                const data = await res.json();
                if (res.ok) setSettings(prev => ({ ...prev, confessionMode: data.confessionMode }));
            } catch (e) { } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [authFetch]);

    const updateSetting = async (key, value) => {
        setSaving(true);
        try {
            const res = await authFetch('/api/admin/settings', {
                method: 'PATCH',
                body: JSON.stringify({ [key]: value }),
            });
            if (res.ok) setSettings(prev => ({ ...prev, [key]: value }));
        } catch (e) { } finally {
            setSaving(false);
        }
    };

    return (
        <div className="uv-page" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <UvPanel title="Feature Architecture">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Confession Mode</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>WEEKLY ANONYMOUS MODULE (FRIDAY)</div>
                            </div>
                            <UvButton 
                                variant={settings.confessionMode ? 'primary' : 'outline'}
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                onClick={() => updateSetting('confessionMode', !settings.confessionMode)}
                                disabled={saving}
                            >
                                {settings.confessionMode ? 'ENABLED' : 'DISABLED'}
                            </UvButton>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>Student Registration</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>OPEN FOR UNIVERSITY EMAIL DOMAINS</div>
                            </div>
                            <UvButton 
                                variant={!settings.registrationClosed ? 'primary' : 'outline'}
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                onClick={() => setSettings(prev => ({ ...prev, registrationClosed: !prev.registrationClosed }))}
                            >
                                {!settings.registrationClosed ? 'ACTIVE' : 'LOCKED'}
                            </UvButton>
                        </div>
                    </div>
                </UvPanel>

                <UvPanel title="Security & Access">
                    <UvInput 
                        label="Allowed Email Domains" 
                        defaultValue="university.edu, college.ac.in" 
                        placeholder="e.g. university.edu, college.ac.in"
                    />
                    <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)', marginTop: '8px' }}>COMMA-SEPARATED WHITELIST FOR STUDENT AUTHENTICATION.</div>
                </UvPanel>

                <UvPanel title={<span style={{ color: 'var(--uv-primary)' }}>Danger Zone</span>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(232, 67, 10, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(232, 67, 10, 0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--uv-primary)' }}>Maintenance Mode</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>TEMPORARILY DISABLE ENTIRE PLATFORM</div>
                            </div>
                            <UvButton variant="outline" style={{ color: 'var(--uv-primary)', borderColor: 'var(--uv-primary)', fontSize: '11px' }}>ENABLE LOCK</UvButton>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(232, 67, 10, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(232, 67, 10, 0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--uv-primary)' }}>Purge Flagged Content</div>
                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>WIPE ALL SPAM/TOXIC DATA CACHE</div>
                            </div>
                            <UvButton variant="outline" style={{ color: 'var(--uv-primary)', borderColor: 'var(--uv-primary)', fontSize: '11px' }}>PURGE ALL</UvButton>
                        </div>
                    </div>
                </UvPanel>
            </div>
        </div>
    );
}
