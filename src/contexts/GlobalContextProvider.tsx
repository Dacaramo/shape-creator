import { createContext } from 'react';

interface Props {}

const getInitialProps = (): void => {
  /**
   * TODO
   */
};

const AppContext = createContext<Props | null>(null);

export default AppContext;
