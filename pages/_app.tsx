import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
  <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>
  <Component {...pageProps} />
  </>)
}

export default MyApp;