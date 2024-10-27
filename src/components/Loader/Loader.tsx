import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import classes from './Loader.module.scss';

function Loader() {
    return (
        <Box className={classes['wg-loader-container']}>
            <React.Fragment>
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#163300" />
                            <stop offset="100%" stopColor="#9fe870" />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress size={120} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
            </React.Fragment>
        </Box>
    );
}

export default Loader;
