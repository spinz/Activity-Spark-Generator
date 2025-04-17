import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || 'Registration failed');
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {errorMsg && <div className="error">{errorMsg}</div>}
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
