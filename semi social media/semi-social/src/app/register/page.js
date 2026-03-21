'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(form.name, form.email, form.registrationNumber, form.password);
            router.replace('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e5e5e5' }}>
                
                {/* Header */}
                <div style={{ padding: '32px 32px 24px 32px', borderBottom: '1px solid #eaeaea' }}>
                    <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '0.05em' }}>
                        ACCOUNT ENROLLMENT
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            FULL NAME
                        </label>
                        <input 
                            name="name"
                            type="text"
                            placeholder="OPERATOR NAME"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                fontSize: '15px',
                                color: '#111827',
                                backgroundColor: '#ffffff',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            INSTITUTIONAL EMAIL
                        </label>
                        <input 
                            name="email"
                            type="email"
                            placeholder="user@university.edu"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                fontSize: '15px',
                                color: '#111827',
                                backgroundColor: '#ffffff',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Reg Number */}
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            REGISTRATION NUMBER
                        </label>
                        <input 
                            name="registrationNumber"
                            type="text"
                            placeholder="E.G. 2024CS001"
                            value={form.registrationNumber}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                fontSize: '15px',
                                color: '#111827',
                                backgroundColor: '#ffffff',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Passwords */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                PASSWORD
                            </label>
                            <input 
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    color: '#111827',
                                    backgroundColor: '#ffffff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                CONFIRM
                            </label>
                            <input 
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    color: '#111827',
                                    backgroundColor: '#ffffff',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '13px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginTop: '-8px' }}>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#ea580c',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {loading ? 'ENROLLING...' : 'ENROLL NOW'}
                    </button>

                    <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid #eaeaea', paddingTop: '32px' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Already registered?{' '}
                            <Link href="/login" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'none' }}>Access Portal</Link>
                        </p>
                    </div>
                </form>
            </div>
            
            <style jsx>{`
                input:focus {
                    border-color: #ea580c !important;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1) !important;
                }
                button[type="submit"]:hover {
                    background-color: #c2410c !important;
                }
                input::placeholder {
                    color: #9ca3af;
                    font-weight: 400;
                }
            `}</style>
        </div>
    );
}
