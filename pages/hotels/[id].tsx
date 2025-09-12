import React from 'react';
import { GetServerSideProps } from 'next';
import HotelView from '@/pages/Hotels/Hotel';
import { withAuthSync } from '@/settings/auth';

const Hotel = () => {
    return <HotelView />;
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

export default withAuthSync(Hotel);
