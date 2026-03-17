'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

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
                if (res.ok) setSettings({ ...settings, confessionMode: data.confessionMode });
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
            if (res.ok) setSettings({ ...settings, [key]: value });
        } catch (e) { } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8">System Settings</h1>

            <div className="max-w-2xl flex flex-col gap-6">
                <div className="card">
                    <h3 className="text-lg font-bold mb-6">Feature Control</h3>
                    <div className="flex flex-col gap-4">
                        <div className="controlItem">
                            <div>
                                <p className="font-bold">Confession Mode</p>
                                <p className="text-xs text-muted">Allow students to submit anonymous confessions. (Req: Friday)</p>
                            </div>
                            <div
                                className={`toggle ${settings.confessionMode ? 'active' : ''}`}
                                onClick={() => updateSetting('confessionMode', !settings.confessionMode)}
                            ></div>
                        </div>

                        <div className="controlItem">
                            <div>
                                <p className="font-bold">Student Registration</p>
                                <p className="text-xs text-muted">Allow new students to sign up using university emails.</p>
                            </div>
                            <div
                                className={`toggle ${!settings.registrationClosed ? 'active' : ''}`}
                                onClick={() => setSettings({ ...settings, registrationClosed: !settings.registrationClosed })}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-6">Security & Domains</h3>
                    <div className="flex flex-col gap-4">
                        <div className="input-group">
                            <label>Allowed Email Domains</label>
                            <input className="input-field" defaultValue="university.edu, college.ac.in" />
                            <p className="text-[10px] text-muted">Comma separated list of domains allowed for student signup.</p>
                        </div>
                    </div>
                </div>

                <div className="card border-l-4 border-l-accent-rose">
                    <h3 className="text-lg font-bold mb-6 text-accent-rose">Danger Zone</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center p-4 rounded-lg bg-bg-secondary border border-accent-rose border-opacity-20">
                            <div>
                                <p className="font-bold">Maintenance Mode</p>
                                <p className="text-xs text-muted">Lock the entire platform for maintenance.</p>
                            </div>
                            <button className="btn btn-danger btn-sm">Enable</button>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-lg bg-bg-secondary border border-accent-rose border-opacity-20">
                            <div>
                                <p className="font-bold">Purge Flagged Content</p>
                                <p className="text-xs text-muted">Permanently delete all content marked as high-risk spam.</p>
                            </div>
                            <button className="btn btn-danger btn-sm">Purge All</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
