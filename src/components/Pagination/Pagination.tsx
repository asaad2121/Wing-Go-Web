import React, { useState } from 'react';
import { Box, Pagination, Select, MenuItem, TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import classes from './Pagination.module.scss';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const PaginationBar: React.FC<PaginationBarProps> = ({
    currentPage,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: isMobile ? '80%' : 80,
                backgroundColor: '#9fe870',
            },
        },
    };
    const [gotoPage, setGotoPage] = useState('');

    const handleGotoPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(gotoPage, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                onPageChange(pageNum);
                setGotoPage('');
            }
        }
    };

    return (
        <Box className={classes['wg-pagination-root']}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
                sx={{
                    '& .MuiPaginationItem-root': {
                        color: '#9fe870 !important',
                        fontSize: '18px !important',
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: '#9fe870 !important',
                        color: '#163300 !important',
                    },
                }}
            />

            <Select
                size="small"
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className={classes['wg-pagination-select']}
                MenuProps={MenuProps}
            >
                {[15, 20, 50, 100].map((option) => (
                    <MenuItem key={option} value={option} className={classes['wg-pagination-menuItem']}>
                        {option} per page
                    </MenuItem>
                ))}
            </Select>

            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">Go To Page</Typography>
                <TextField
                    size="small"
                    type="number"
                    value={gotoPage}
                    onChange={(e) => setGotoPage(e.target.value)}
                    onKeyDown={handleGotoPage}
                    placeholder="Page"
                    className={classes['wg-pagination-textField']}
                    inputProps={{ min: 1, max: totalPages }}
                />
            </Box>
        </Box>
    );
};

export default PaginationBar;
