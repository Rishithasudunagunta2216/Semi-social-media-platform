'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState('student');
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('role') === 'admin') {
            setRole('admin');
        }
    }, []);

    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (role === 'admin') {
                user = await login(email, password);
                if (user?.role !== 'admin') {
                    throw new Error("You do not have admin access.");
                }
                router.replace('/admin');
            } else {
                user = await login(email, password);
                if (user?.role === 'admin') {
                    router.replace('/admin');
                } else {
                    router.replace('/dashboard');
                }
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', padding: '40px 32px', border: '1px solid #e5e5e5' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        margin: '0 auto 16px', 
                        width: '56px', 
                        height: '56px', 
                        background: '#ea580c', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)'
                    }}>
                        U
                    </div>
                    <h1 style={{ fontFamily: 'var(--uv-font-heading)', fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 8px 0', letterSpacing: '0.02em' }}>
                        UNIVERA
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, letterSpacing: '0.02em' }}>University Academic Platform</p>
                </div>

                {/* Role Toggle */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    <button 
                        type="button"
                        onClick={() => setRole('student')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: role === 'student' ? '1px solid #ea580c' : '1px solid #e5e7eb',
                            backgroundColor: role === 'student' ? '#ffedd5' : '#ffffff',
                            color: role === 'student' ? '#c2410c' : '#4b5563',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        🎓 Student
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('admin')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: role === 'admin' ? '1px solid #ea580c' : '1px solid #e5e7eb',
                            backgroundColor: role === 'admin' ? '#ffedd5' : '#ffffff',
                            color: role === 'admin' ? '#c2410c' : '#4b5563',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        🔒 Admin
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            COLLEGE EMAIL
                        </label>
                        <input 
                            type="email"
                            placeholder="yourname@srmap.edu.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {role === 'student' ? 'REGISTRATION NUMBER' : 'PASSWORD'}
                        </label>
                        <input 
                            type={role === 'student' ? 'text' : 'password'}
                            placeholder={role === 'student' ? 'AP220011' : '••••••••'}
                            value={role === 'student' ? registrationNumber : password}
                            onChange={(e) => role === 'student' ? setRegistrationNumber(e.target.value) : setPassword(e.target.value)}
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
                    {role === 'student' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                PASSWORD
                            </label>
                            <input 
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    )}

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
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
                    </button>
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
