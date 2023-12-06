import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout';
import { SiteProvider } from '@/components/context';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SiteProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SiteProvider>
  );
};

export default App;