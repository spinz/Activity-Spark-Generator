import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing name, email, or password' });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  // Assign ADMIN role to first user, USER to others
  const totalUsers = await prisma.user.count();
  const role = totalUsers === 0 ? 'ADMIN' : 'USER';
  const user = await prisma.user.create({ data: { name, email, hashedPassword, role } });
  return res.status(201).json({ id: user.id, email: user.email });
}
