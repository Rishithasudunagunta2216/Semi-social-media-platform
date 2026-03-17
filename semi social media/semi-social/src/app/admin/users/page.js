'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

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
        fetchUsers();
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
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-muted">Monitor student activity and restrict access to community rule-breakers.</p>
                </div>
            </div>

            <div className="card card-glass mb-8">
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        className="input-field"
                        placeholder="Search students by name, email, or registration number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="userTableContainer">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student Details</th>
                            <th>Reg. Number</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i}><td colSpan="5" className="h-16 skeleton"></td></tr>
                            ))
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10 text-muted">No students found.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-[10px] text-muted">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm font-mono text-primary-light">{user.registrationNumber}</td>
                                    <td>
                                        {user.isBlocked ? (
                                            <span className="badge badge-danger">Suspended</span>
                                        ) : (
                                            <span className="badge badge-success">Active</span>
                                        )}
                                    </td>
                                    <td className="text-xs text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="text-right">
                                        <button
                                            className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                                            onClick={() => toggleBlock(user._id, user.isBlocked)}
                                        >
                                            {user.isBlocked ? 'Unblock' : 'Restrict Access'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
