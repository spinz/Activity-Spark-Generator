import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../lib/prisma';
import Link from 'next/link';

export default function AdminPage({ users }) {
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
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
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
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
  return { props: { users: JSON.parse(JSON.stringify(users)) } };
}
