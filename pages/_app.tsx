import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout';

import { createContext, useContext, useState } from 'react';

const defaultSite = false;

interface SiteContextType {
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SiteContext = createContext<SiteContextType>({
  flag: false,
  setFlag: () => { }
});

interface SiteProviderType {
  children: React.ReactNode;
}

const SiteProvider: React.FC<SiteProviderType> = ({ children }) => {
  const [flag, setFlag] = useState<boolean>(defaultSite);
  const context = { flag, setFlag };

  return (
    <SiteContext.Provider value={context}>
      {children}
    </SiteContext.Provider>
  );
};

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