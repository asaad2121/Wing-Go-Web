import { logOut } from '@/redux/features/auth/auth-slice';
import { store } from '@/redux/store';
import { useRouter, withRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const withAuthSync = (WrappedComponent: React.ComponentType<any>, customProps?: any) => {
    const WithAuthSyncClass = (props: any) => {
        const [loading, setLoading] = useState(true);
        const Router = useRouter();

        const fetchSession = async () => {
            const auth = store.getState().auth.value;
            let shouldRedirectToLogin = false;
            if (!auth?.isAuthenticated) {
                shouldRedirectToLogin = true;
            }

            if (shouldRedirectToLogin) {
                let redirectTo = null;
                if ((props.router || {}).route) {
                    redirectTo = props.router.asPath;
                }
                store.dispatch(logOut());
                Router.push('/login');
            } else {
                setLoading(false);
                window.addEventListener('storage', syncLogout);
            }
        };

        useEffect(() => {
            fetchSession();
            return () => {
                window.removeEventListener('storage', syncLogout);
            };
        }, []);

        const syncLogout = (event: any) => {
            if (event.key === 'logout') Router.push('/login');
        };

        // if (loading) return <div>Loading...</div>;
        return <WrappedComponent {...props} />;
    };

    return withRouter(WithAuthSyncClass);
};
