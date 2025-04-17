// pages/_app.js
import '../public/style.css';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component session={session} {...pageProps} />
    </SessionProvider>
  );
}
