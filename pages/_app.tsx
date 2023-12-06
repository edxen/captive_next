import { GlobalStyles } from '@/styles/globalstyles';
import { ServerStyleSheet } from 'styled-components';
import { AppProps } from 'next/app';
import Layout from '@/components/layout';
import { SiteProvider } from '@/components/context';
import { useState, useEffect } from 'react';

interface MyAppProps extends AppProps {
  styles: string;
}

const MyApp = ({ Component, pageProps, styles }: MyAppProps) => {
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

MyApp.getInitialProps = async ({ Component, ctx }: { Component: any; ctx: any; }) => {
  const sheet = new ServerStyleSheet();
  try {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const page = sheet.collectStyles(<Component {...pageProps} />);
    const styleTags = sheet.getStyleTags();

    return { ...pageProps, styles: styleTags };
  } finally {
    sheet.seal();
  }
};

export default MyApp;
