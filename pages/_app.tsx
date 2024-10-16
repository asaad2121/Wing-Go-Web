import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { ReduxProvider } from '@/redux/provider';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <ReduxProvider>
                <CssBaseline />
                <ApolloProvider client={client}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </ReduxProvider>
        </>
    );
}

export default MyApp;
