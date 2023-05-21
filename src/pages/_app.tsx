import { type AppType } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

import { trpc } from '../utils/trpc';

import '../styles/themes.css';
import '../styles/register.css';
import '../styles/index.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default trpc.withTRPC(MyApp);
