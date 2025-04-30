import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/styles/theme';
import '../src/styles/global.css';
import SnackBar from '@/components/Snackbar/Snackbar';
import NavBar from '@/components/Navbar/NavBar';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPageTitleFromPath } from '@/shared/utility';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const dynamicTitle = `${getPageTitleFromPath(router.pathname)} | WingGo`;
    return (
        <>
            <Head>
                <title>{dynamicTitle}</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <ApolloProvider client={client}>
                        <NavBar />
                        <Component {...pageProps} />
                    </ApolloProvider>
                </Provider>
                <SnackBar />
            </ThemeProvider>
        </>
    );
}

export default MyApp;
