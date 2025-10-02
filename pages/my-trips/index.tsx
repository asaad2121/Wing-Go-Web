import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuthSync } from '@/settings/auth';
import UserTrips from '@/pages/UserTrips/UserTrips';

const MyTripsPage = () => {
    return <UserTrips />;
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

export default withAuthSync(MyTripsPage);
