import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.replace('/');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {errorMsg && <div className="error">{errorMsg}</div>}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link href="/auth/register">Register</Link>
      </p>
    </div>
  );
}
