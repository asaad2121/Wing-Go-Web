import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { ReduxProvider } from '@/redux/provider';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/styles/theme';
import '../src/styles/global.css';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&display=swap"
                rel="stylesheet"
            />
            <style jsx global>{`
                html {
                    font-family: 'Afacad Flux', sans-serif;
                }
            `}</style>
            <ReduxProvider>
                <CssBaseline />
                <ApolloProvider client={client}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </ReduxProvider>
        </ThemeProvider>
    );
}

export default MyApp;
