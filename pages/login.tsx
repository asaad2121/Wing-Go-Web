import React from 'react';
import LoginWizard from '@/pages/Login/LoginWizard';
import { GetServerSideProps } from 'next';
interface LoginProps {
    isMobileServer: boolean;
}

const Login: React.FC<LoginProps> = ({ isMobileServer }) => {
    return <LoginWizard isMobileServer={isMobileServer} />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const userAgent = req.headers['user-agent'];
    const isMobileServer = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile/.test(userAgent || '');
    return {
        props: {
            isMobileServer,
        },
    };
};

export default Login;
