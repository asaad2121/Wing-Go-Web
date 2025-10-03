import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/styles/theme';
import '../src/styles/global.css';
import SnackBar from '@/components/Snackbar/Snackbar';
import NavBar from '@/components/Navbar/Navbar';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPageTitleFromPath } from '@/shared/utility';
import { useMemo } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const dynamicTitle = `${getPageTitleFromPath(router.pathname)} | WingGo`;

    // Create Apollo Client only on the client side
    const client = useMemo(() => {
        if (typeof window === 'undefined') return null; // SSR: skip
        return new ApolloClient({
            link: new HttpLink({
                uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8000/graphql',
            }),
            cache: new InMemoryCache(),
        });
    }, []);

    return (
        <>
            <Head>
                <title>{dynamicTitle}</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    {client ? (
                        <ApolloProvider client={client}>
                            <NavBar />
                            <Component {...pageProps} />
                        </ApolloProvider>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </Provider>
                <SnackBar />
            </ThemeProvider>
        </>
    );
}

export default MyApp;
