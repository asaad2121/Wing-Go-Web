import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Paper, Typography } from '@mui/material';
import classes from './DashboardWizard.module.scss';

interface StepItem {
    title: string;
    description: string;
}

const DashboardWizard: React.FC = () => {
    const steps: StepItem[] = [
        {
            title: 'Card 1',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        },
        {
            title: 'Card 2',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
            title: 'Card 3',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
        },
    ];

    return (
        <>
            <Box className={classes['wg-dashboard-container']}>
                <div className={classes['wg-carousel-container']}>
                    <Carousel animation="slide" navButtonsAlwaysVisible indicators autoPlay={false}>
                        {steps?.map((step, index) => (
                            <Paper key={index} className={classes['wg-carousel-slide']}>
                                <Typography variant="h5" gutterBottom>
                                    {step?.title}
                                </Typography>
                                <Typography variant="body1">{step?.description}</Typography>
                            </Paper>
                        ))}
                    </Carousel>
                </div>
            </Box>
        </>
    );
};

export default DashboardWizard;
