import React from 'react';
import { GetServerSideProps } from 'next';
import TripPlannerWizard from '@/pages/TripPlanner/TripPlannerWizard';
import { withAuthSync } from '@/settings/auth';

const TripPlannerStepsPage = () => {
    return <TripPlannerWizard />;
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

export default withAuthSync(TripPlannerStepsPage);
