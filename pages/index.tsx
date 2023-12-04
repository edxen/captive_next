import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchAPI } from '../components/utils';
import { Site, Data } from '../components/inteface';
import Layout from '../components/layout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();

  const [site, setSite] = useState<Site | null>(null);
  const [redirected, setRedirected] = useState<boolean>(false);

  const fetchSite = async () => {
    const data = await fetchAPI({ target: "handler", method: "GET" }) as Data;
    if (data) {
      setSite(data.site);

      let template: string = 'authentication';
      if (site?.connected.status) template = 'connected';

      if (!redirected) {
        setRedirected(true);
        router.push(`/templates/${template}`);
      }
    }
  };

  useEffect(() => {
    let isMounted: boolean = true;

    fetchSite();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Captive Portal Next</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Layout isLoading={true} />
      </main>
    </>
  );
}
