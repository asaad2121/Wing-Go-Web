import React from 'react';
import { GetServerSideProps } from 'next';
import TouristPlaceView from '@/pages/Tourists/TouristPlace';
import { withAuthSync } from '@/settings/auth';

const TouristPlace = () => {
    return <TouristPlaceView />;
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

export default withAuthSync(TouristPlace);
