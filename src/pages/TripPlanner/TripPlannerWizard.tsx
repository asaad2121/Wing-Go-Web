import React, { useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import TPStepSelect from './TripPlannerSteps/Select';
import TPStepReview from './TripPlannerSteps/Review';
import classes from './TripPlanner.module.scss';
import { useRouter } from 'next/router';

const steps = ['Select City & Tourist Places', 'Select your hotels'];

const TripPlannerWizard: React.FC = () => {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState<0 | 1>(0);

    const handleNextStep = () => {
        setActiveStep((prev) => (prev < 1 ? ((prev + 1) as 0 | 1) : prev));
    };

    const handleBackStep = () => {
        setActiveStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1) : prev));
    };

    const handleCompleted = () => {
        router.push('/trip-planner/completed');
    };

    return (
        <Box className={classes['wg-tripPlanner-wizard-container']}>
            <Stepper activeStep={activeStep} alternativeLabel className={classes['wg-tripPlanner-wizard-stepper']}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box className={classes['wg-tripPlanner-wizard-stepContent']}>
                {(() => {
                    switch (activeStep) {
                        case 0:
                            return <TPStepSelect handleNext={handleNextStep} />;
                        case 1:
                            return <TPStepReview handleBack={() => handleBackStep()} handleNext={handleCompleted} />;
                        default:
                            return null;
                    }
                })()}
            </Box>
        </Box>
    );
};

export default TripPlannerWizard;
