import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../lib/prisma';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage({ users }) {
  const [userList, setUserList] = useState(users);
  const handleApprove = async (id) => {
    const res = await fetch('/api/admin/approve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id })
    });
    if (res.ok) setUserList(userList.map(u => u.id === id ? { ...u, approved: true } : u));
    else alert('Account approval failed');
  };

  const handleSuspend = async (id, action) => {
    const res = await fetch('/api/admin/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, action })
    });
    if (res.ok) setUserList(userList.map(u => u.id === id ? { ...u, suspended: action === 'suspend' } : u));
    else alert('Failed to update suspend state');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id })
    });
    if (res.ok) setUserList(userList.filter(u => u.id !== id));
    else alert('Failed to delete user');
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Approved</th>
            <th>Suspended</th>
            <th>Queries</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.approved ? 'Yes' : 'No'}</td>
              <td>{u.suspended ? 'Yes' : 'No'}</td>
              <td>{u.apiQueryCount}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>
                {!u.approved && <button onClick={() => handleApprove(u.id)}>Approve</button>}
                {!u.suspended && <button onClick={() => handleSuspend(u.id, 'suspend')}>Suspend</button>}
                {u.suspended && <button onClick={() => handleSuspend(u.id, 'resume')}>Resume</button>}
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">Back to Home</Link>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/login', permanent: false } };
  }
  if (session.user.role !== 'ADMIN') {
    return { redirect: { destination: '/', permanent: false } };
  }
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true, approved: true, suspended: true, apiQueryCount: true } });
  return { props: { users: JSON.parse(JSON.stringify(users)) } };
}
