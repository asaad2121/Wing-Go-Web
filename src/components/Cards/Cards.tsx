import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Divider, Rating, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import classes from './Cards.module.scss';
import { limitedCharString } from '@/shared/utility';

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

type CardsProps = {
    imageUrl?: string;
    title?: string;
    rating?: number;
    address?: string;
    cost?: string;
    onClick?: () => void;
    isTouristPlace?: boolean | false;
    description?: string;
    titleLimit?: number;
    hideRatings?: boolean;
};

const CardsComponent = React.forwardRef<HTMLDivElement, CardsProps>(
    (
        { imageUrl, title, rating, address, cost, onClick, isTouristPlace, description, hideRatings, titleLimit },
        ref
    ) => {
        const isTablet = useMediaQuery('(max-width:1158px) and (min-width:775px)');
        const [titleText] = useState(limitedCharString(title || '', titleLimit || 19));
        const [addressText, setAddressText] = useState(address || '');

        useEffect(() => {
            if (isTouristPlace) return;
            const limit = isTablet ? 48 : 60;
            setAddressText(limitedCharString(address || '', limit));
        }, [address, isTablet, isTouristPlace]);

        const getRatingValue = (rating: number) => {
            if (rating > 4) return 'Excellent';
            if (rating > 3) return 'Great';
            if (rating > 2) return 'Good';
            if (rating > 1) return 'Poor';
            return 'Poor';
        };

        const [ratingValue] = useState(getRatingValue(rating || 0));

        return (
            <Card className={classes['wg-Cards-root']} onClick={onClick}>
                <CardMedia className={classes['wg-Cards-cardMedia']} image={imageUrl} title={titleText} />
                <CardContent className={classes['wg-Cards-cardContent']}>
                    <div className={classes[isTouristPlace ? 'wg-Cards-topContent-desc' : 'wg-Cards-topContent']}>
                        <div className={classes['wg-Cards-title-rating']}>
                            <Typography variant="h5" className={classes['wg-Cards-title']}>
                                {titleText}
                            </Typography>
                            {!isTouristPlace && !hideRatings && (
                                <Rating
                                    name="rating"
                                    value={parseFloat(rating?.toString() || '0')}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                />
                            )}
                        </div>
                        <Typography gutterBottom className={classes['wg-Cards-address']}>
                            {addressText}
                        </Typography>
                    </div>
                    {!isTouristPlace && !hideRatings && (
                        <div className={classes['wg-Cards-bottomContent']}>
                            <Typography className={classes['wg-Cards-rating']}>{rating}</Typography>
                            <Typography className={classes['wg-Cards-rating-5']}>/5</Typography>
                            <Typography className={classes['wg-Cards-ratingValue']}>{ratingValue}</Typography>
                        </div>
                    )}
                </CardContent>
                <Divider />

                {description && (
                    <CardActions className={classes['wg-Cards-cardActions-desc']}>
                        <Typography className={classes['wg-Cards-description']}>{description}</Typography>
                    </CardActions>
                )}

                {cost && (
                    <CardActions className={classes['wg-Cards-cardActions']}>
                        <Typography className={classes['wg-Cards-cost']}>
                            <b>${parseInt(cost || '', 10)}</b>
                        </Typography>
                        <Typography className={classes['wg-Cards-perNight']}>
                            Per {!isTouristPlace ? 'night' : 'person'}
                        </Typography>
                    </CardActions>
                )}
            </Card>
        );
    }
);

CardsComponent.displayName = 'CardsComponent';
export default CardsComponent;
