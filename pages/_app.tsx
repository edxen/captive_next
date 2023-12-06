import { GlobalStyles } from '@/styles/globalstyles';
import { ServerStyleSheet } from 'styled-components';
import { AppProps } from 'next/app';
import Layout from '@/components/layout';
import { SiteProvider } from '@/components/context';
import { useState, useEffect } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <SiteProvider>
      {
        isMounted &&
        <>
          <GlobalStyles />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      }

    </SiteProvider>
  );
};

export default App;
