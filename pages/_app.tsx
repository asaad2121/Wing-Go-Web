import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { ReduxProvider } from '@/redux/provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <>
      <ReduxProvider>
        <CssBaseline/>
        <Component {...pageProps} />
      </ReduxProvider>
  </>)
}

export default MyApp;