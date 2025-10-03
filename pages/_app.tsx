// pages/_app.tsx
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import theme from '@/styles/theme';
import createEmotionCache from '@/styles/createEmotionCache';
import { store } from '@/redux/store';
import SnackBar from '@/components/Snackbar/Snackbar';
import Navbar from '@/components/Navbar/Navbar';
import { getPageTitleFromPath } from '@/shared/utility';
import '../src/styles/global.css';

// Create a client-side Emotion cache
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
    const router = useRouter();
    const dynamicTitle = `${getPageTitleFromPath(router.pathname)} | WingGo`;

    // Apollo Client
    const client = useMemo(() => {
        return new ApolloClient({
            link: new HttpLink({
                uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8000/graphql',
            }),
            cache: new InMemoryCache(),
        });
    }, []);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>{dynamicTitle}</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <ApolloProvider client={client}>
                        <Navbar />
                        <Component {...pageProps} />
                    </ApolloProvider>
                </Provider>
                <SnackBar />
            </ThemeProvider>
        </CacheProvider>
    );
}

export default MyApp;
