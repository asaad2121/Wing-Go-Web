import React from 'react';
import SignupWizard from '@/pages/Signup/SignupWizard';
import { GetServerSideProps } from 'next';
interface SignupProps {
    isMobileServer: boolean;
}

const Signup: React.FC<SignupProps> = ({ isMobileServer }) => {
    return <SignupWizard isMobileServer={isMobileServer} />;
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

export default Signup;
