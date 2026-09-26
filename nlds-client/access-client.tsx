"use client";
import React, { useState } from 'react';
import { Shield, Plus, X, Save, UserPlus, ChevronRight, Lock } from 'lucide-react';

// Stub types since the original imports are missing
type AdminDTO = any;
const PERMISSION_DEFINITIONS: any[] = [];

/** Display label + badge class per admin role. */
const ROLE_META: Record<string, { label: string; badge: string; color: string }> = {
    SUPER_ADMIN: { label: 'SUPER ADMIN', badge: 'badge-super', color: 'var(--red)' },
    DELVP: { label: 'DELVP', badge: 'badge-delvp', color: 'var(--status-review)' },
    FINVP: { label: 'FINVP', badge: 'badge-finvp', color: 'var(--nlds-blue)' },
    OC_VIEWER: { label: 'OC VIEWER', badge: '', color: 'var(--text-muted)' },
};

export default function AccessManagerClient({ initialAdmins }: { initialAdmins: AdminDTO[] }) {
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState<'OC_VIEWER' | 'DELVP' | 'FINVP'>('OC_VIEWER');
    const [busyCreate, setBusyCreate] = useState(false);
    const [createError, setCreateError] = useState("");

    const [selected, setSelected] = useState<AdminDTO | null>(null);
    const [localPerms, setLocalPerms] = useState<string[]>([]);
    const [busyPerms, setBusyPerms] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError("");
        setBusyCreate(true);
        try {
            const res = await fetch("/api/admin/rbac/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole })
            });
            const data = await res.json();
            if (res.ok) {
                setShowCreate(false);
                setNewName("");
                setNewEmail("");
                setNewPassword("");
                setNewRole('OC_VIEWER');
                window.location.reload();
            } else {
                setCreateError(data.error || "Failed.");
            }
        } catch { setCreateError("Network error."); }
        setBusyCreate(false);
    };

    const openPerms = (admin: AdminDTO) => {
        if (admin.role === "SUPER_ADMIN") return;
        setSelected(admin);
        setLocalPerms([...admin.permissions]);
    };

    const togglePerm = (id: string) => {
        setLocalPerms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    };

    const savePerms = async () => {
        if (!selected) return;
        setBusyPerms(true);
        await fetch(`/api/admin/users/${selected.id}/permissions`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ permissions: localPerms })
        });
        setBusyPerms(false);
        setSelected(null);
        window.location.reload();
    };

    const toggleActive = async (admin: AdminDTO) => {
        if (admin.role === "SUPER_ADMIN") return;
        if (!confirm(`${admin.isActive ? 'Deactivate' : 'Activate'} ${admin.email}?`)) return;
        await fetch("/api/admin/rbac/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetId: admin.id, isActive: !admin.isActive })
        });
        window.location.reload();
    };

    return (
        <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-5">
                <p className="text-meta flex items-center gap-2">
                    <Shield size={14} strokeWidth={1.5} />
                    {initialAdmins.length} registered operator(s)
                </p>
                <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
                    <UserPlus size={14} /> New Operator
                </button>
            </div>

            {/* Operator Table */}
            <div className="border border-[var(--border)] overflow-hidden transition-opacity">
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Operator</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Permissions</th>
                                <th>Last Login</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialAdmins.map(a => {
                                const meta = ROLE_META[a.role] || ROLE_META.OC_VIEWER;
                                return (
                                    <tr key={a.id} className={!a.isActive ? 'opacity-40' : ''}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${meta.color}20, ${meta.color}08)`,
                                                        border: `1px solid ${meta.color}50`,
                                                    }}
                                                >
                                                    <span className="font-display text-[11px] tracking-wider leading-none" style={{ color: meta.color }}>
                                                        {(a.name || a.email).split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[var(--text)] font-medium block">
                                                        {a.name || a.email.split('@')[0]}
                                                    </span>
                                                    <span className="block font-mono text-[10px] text-[var(--text-ghost)] mt-0.5">
                                                        {a.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${meta.badge}`}>{meta.label}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${a.isActive ? 'badge-active' : 'badge-inactive'}`}>
                                                {a.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-[10px] text-[var(--text-ghost)]">
                                                {a.role === "SUPER_ADMIN"
                                                    ? 'ALL PERMISSIONS'
                                                    : `${a.permissions.length} granted`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                                {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString() : '—'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {a.role !== "SUPER_ADMIN" ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openPerms(a)}
                                                        className="btn-ghost"
                                                        title="Edit permissions"
                                                    >
                                                        Permissions
                                                    </button>
                                                    <button
                                                        onClick={() => toggleActive(a)}
                                                        className="btn-ghost"
                                                        style={{ color: a.isActive ? 'var(--status-rejected)' : 'var(--status-accepted)' }}
                                                    >
                                                        {a.isActive ? 'Suspend' : 'Restore'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="font-mono text-[9px] text-[var(--text-ghost)] tracking-wider flex items-center justify-end gap-1">
                                                    <Shield size={10} /> PROTECTED
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══ Create Modal ═══ */}
            {showCreate && (
                <div className="modal-overlay">
                    <div className="modal-panel max-w-[600px] p-0 max-h-[90vh] min-h-[75vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4">
                            <div>
                                <h2 className="text-card-title text-[15px]">New Operator Account</h2>
                                <p className="text-meta mt-1">Create a new admin with scoped access</p>
                            </div>
                            <button onClick={() => setShowCreate(false)} className="w-8 h-8 flex items-center justify-center text-[var(--text-ghost)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] rounded-md transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

                        <form onSubmit={handleCreate} className="p-6 space-y-5 overflow-y-auto flex-1">
                            {createError && (
                                <div className="border border-[var(--border-red)] bg-[rgba(196,30,58,0.06)] px-4 py-3 rounded-sm">
                                    <p className="font-mono text-[11px] text-[var(--red)] flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
                                        {createError}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="label-classified block mb-2">Name</label>
                                <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                                    disabled={busyCreate} className="admin-input" placeholder="Agent name" />
                            </div>

                            {/* Role Selector */}
                            <div>
                                <label className="label-classified block mb-2">Role</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {(['OC_VIEWER', 'DELVP', 'FINVP'] as const).map(r => {
                                        const active = newRole === r;
                                        const roleMeta = ROLE_META[r];
                                        return (
                                            <button key={r} type="button" disabled={busyCreate}
                                                onClick={() => setNewRole(r)}
                                                className="text-left p-4 border transition-all duration-200 relative overflow-hidden"
                                                style={{
                                                    borderColor: active ? `${roleMeta.color}60` : 'var(--border)',
                                                    background: active ? `${roleMeta.color}08` : 'var(--surface-2)',
                                                    boxShadow: active ? `0 0 16px ${roleMeta.color}10` : 'none',
                                                }}>
                                                {active && (
                                                    <span className="absolute left-0 top-0 bottom-0 w-[2px] block" style={{ background: roleMeta.color }} />
                                                )}
                                                <span className="flex items-center justify-between mb-2 block">
                                                    <span className={`badge ${roleMeta.badge}`} style={{ fontSize: '9px' }}>{roleMeta.label}</span>
                                                    {active && (
                                                        <span className="block w-2 h-2 rounded-full" style={{ background: roleMeta.color, boxShadow: `0 0 6px ${roleMeta.color}` }} />
                                                    )}
                                                </span>
                                                <span className="block font-mono text-[9px] text-[var(--text-ghost)] leading-relaxed mt-1">
                                                    {r === 'DELVP'
                                                        ? 'Reviews applications, records ACCEPT/REJECT decisions'
                                                        : r === 'FINVP'
                                                        ? 'Manages merch orders and verify payments'
                                                        : 'Read-only operations access, adjustable permissions'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="label-classified block mb-2">Email</label>
                                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                                    disabled={busyCreate} className="admin-input" placeholder="member@aiesec.lk" />
                            </div>
                            <div>
                                <label className="label-classified block mb-2">Password</label>
                                <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                    disabled={busyCreate} className="admin-input" placeholder="Min. 8 characters"
                                    style={{ fontFamily: 'var(--font-mono)' }} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreate(false)}
                                    className="btn-secondary flex-1" disabled={busyCreate}>Cancel</button>
                                <button type="submit" className="btn-primary flex-1" disabled={busyCreate}>
                                    {busyCreate ? 'Creating...' : 'Create Operator'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══ Permissions Modal ═══ */}
            {selected && (
                <div className="modal-overlay">
                    <div className="modal-panel max-w-[540px] p-0 h-[70vh]">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-card-title text-[15px]">Edit Permissions</h2>
                                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center text-[var(--text-ghost)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] rounded-md transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${ROLE_META[selected.role]?.color || 'var(--text-muted)'}20, transparent)`,
                                        border: `1px solid ${ROLE_META[selected.role]?.color || 'var(--text-muted)'}30`,
                                    }}
                                >
                                    <span className="font-display text-[11px] tracking-wider" style={{ color: ROLE_META[selected.role]?.color }}>
                                        {(selected.name || selected.email).split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-[var(--text)]">{selected.name || selected.email.split('@')[0]}</p>
                                    <p className="font-mono text-[10px] text-[var(--text-ghost)]">{selected.email}</p>
                                </div>
                                <span className={`badge ${ROLE_META[selected.role]?.badge || ''} ml-auto`}>
                                    {ROLE_META[selected.role]?.label || selected.role}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

                        {/* Permissions list */}
                        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6 min-h-0">
                            <p className="text-meta flex items-center gap-1.5 border-b border-[var(--border)] pb-3">
                                <Lock size={12} /> {localPerms.length} of {PERMISSION_DEFINITIONS.length} granted
                            </p>

                            {/* Group by category */}
                            {['operations', 'intelligence', 'analytics', 'admin'].map(category => {
                                const categoryPerms = PERMISSION_DEFINITIONS.filter((p: any) => p.category === category);
                                if (categoryPerms.length === 0) return null;

                                return (
                                    <div key={category} className="space-y-3">
                                        <h3 className="text-[10px] font-mono tracking-[0.15em] text-[var(--text-muted)] uppercase px-1">
                                            {category}
                                        </h3>
                                        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-md divide-y divide-[var(--border)]">
                                            {categoryPerms.map((p: any) => {
                                                const active = localPerms.includes(p.id);
                                                return (
                                                    <label key={p.id}
                                                        className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.02)] group"
                                                    >
                                                        <input type="checkbox" checked={active} onChange={() => togglePerm(p.id)} className="sr-only" />

                                                        {/* Sleek Toggle Switch */}
                                                        <div
                                                            className="w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out shrink-0"
                                                            style={{
                                                                background: active ? 'var(--red)' : 'var(--surface-3)',
                                                                boxShadow: active ? '0 0 10px rgba(196,30,58,0.3)' : 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                                            }}
                                                        >
                                                            <div
                                                                className="absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm"
                                                                style={{ transform: active ? 'translateX(16px)' : 'translateX(0)' }}
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <span className={`block text-[13px] font-medium transition-colors ${active ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}>
                                                                {p.label}
                                                            </span>
                                                            <span className="block font-mono text-[10px] text-[var(--text-ghost)] tracking-wider mt-0.5">
                                                                {p.description || p.id}
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 shrink-0 border-t border-[var(--border)] bg-[var(--surface-2)]">
                            <div className="flex gap-3">
                                <button onClick={() => setSelected(null)} className="btn-secondary flex-1" disabled={busyPerms}>
                                    Cancel
                                </button>
                                <button onClick={savePerms} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={busyPerms}>
                                    <Save size={13} /> {busyPerms ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
