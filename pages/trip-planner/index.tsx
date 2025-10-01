import React from 'react';
import { GetServerSideProps } from 'next';
import TripPlannerLanding from '@/pages/TripPlanner/TripPlannerLanding';
import { withAuthSync } from '@/settings/auth';

const TripPlannerIndexPage = () => {
    return <TripPlannerLanding />;
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

export default withAuthSync(TripPlannerIndexPage);
