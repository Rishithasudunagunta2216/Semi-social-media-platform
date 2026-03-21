'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UvPanel, UvBadge, UvTag, UvButton, UvInput } from '@/components/UvComponents';

export default function UserControlPage() {
    const { authFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authFetch(`/api/admin/users?search=${searchTerm}`);
            const data = await res.json();
            if (res.ok) setUsers(data.users);
        } catch (e) { } finally {
            setLoading(false);
        }
    }, [authFetch, searchTerm]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [fetchUsers]);

    const toggleBlock = async (id, currentStatus) => {
        try {
            const res = await authFetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ isBlocked: !currentStatus }),
            });
            if (res.ok) fetchUsers();
        } catch (e) { }
    };

    return (
        <div className="uv-page">
            <UvPanel 
                title="Student Registry" 
                headerActions={
                    <div style={{ width: '300px' }}>
                        <UvInput 
                            placeholder="SEARCH BY NAME/UID..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                {loading && users.length === 0 ? (
                    <div className="uv-mono-sm" style={{ padding: '40px 0' }}>RETRIVING REGISTRY...</div>
                ) : users.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>NO MATCHES FOUND FOR "{searchTerm.toUpperCase()}"</div>
                    </div>
                ) : (
                    <table className="uv-table">
                        <thead>
                            <tr>
                                <th>Student Identification</th>
                                <th>UID / Reg Number</th>
                                <th>Account Status</th>
                                <th>Registry Date</th>
                                <th style={{ textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--uv-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                                                <div className="uv-mono-xs" style={{ color: 'var(--uv-muted)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="uv-mono-xs" style={{ color: 'var(--uv-primary)', fontWeight: 600 }}>{user.registrationNumber}</td>
                                    <td>
                                        <UvTag color={user.isBlocked ? 'orange' : 'green'}>
                                            {user.isBlocked ? 'SUSPENDED' : 'ACTIVE'}
                                        </UvTag>
                                    </td>
                                    <td className="uv-mono-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <UvButton 
                                            variant="outline" 
                                            style={{ padding: '6px 12px', fontSize: '11px', color: user.isBlocked ? 'var(--uv-green)' : '#d00' }}
                                            onClick={() => toggleBlock(user._id, user.isBlocked)}
                                        >
                                            {user.isBlocked ? 'RESTORE ACCESS' : 'RESTRICT'}
                                        </UvButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </UvPanel>
        </div>
    );
}
