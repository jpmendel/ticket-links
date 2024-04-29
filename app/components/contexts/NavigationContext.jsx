import { useCallback, useState, createContext } from 'react';
import { Page } from '../../data/page';

export const NavigationContext = createContext({
  navigate: () => {},
});

export const NavigationProvider = ({ pages, initialPage }) => {
  const [page, setPage] = useState(initialPage ?? Page.MAIN);
  const [pageProps, setPageProps] = useState({});

  const navigate = useCallback((page, props = {}) => {
    setPageProps(props);
    setPage(page);
  }, []);

  const PageComponent = pages[page] || null;

  return (
    <NavigationContext.Provider value={{ navigate }}>
      <PageComponent {...pageProps} />
    </NavigationContext.Provider>
  );
};
