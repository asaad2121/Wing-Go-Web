import React, { useState, MouseEvent, useEffect } from 'react';
import { Adb as AdbIcon, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem, IconButton, Typography, Toolbar, Box, AppBar } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './Navbar.module.scss';
import { useAppDispatch, useStoreSelector } from '@/redux/store';
import { logOut } from '@/redux/features/auth/auth-slice';
import { snackbar } from '../Snackbar/Snackbar';

function Navbar() {
    const { isAuthenticated } = useStoreSelector((state) => state.auth.value);
    const dispatch = useAppDispatch();
    const [auth, setAuth] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    useEffect(() => {
        setAuth(isAuthenticated);
    }, [isAuthenticated]);

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = (page: string) => {
        router.push(page);
        handleClose();
    };

    const handleLogout = () => {
        dispatch(logOut());
        snackbar.info('Logged out successfully', 5000);
        router.push('/login');
    };

    return (
        <>
            <AppBar position="static" className={classes['wg-navbar-root']}>
                <Toolbar>
                    <div
                        className={classes['wg-navbar-main-icon']}
                        onClick={() => router.push(auth ? '/dashboard' : '/')}
                    >
                        <AdbIcon />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            WingGo
                        </Typography>
                    </div>
                    <Box>
                        {auth ? (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            backgroundColor: '#9fe870',
                                            color: '#163300',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => handleRedirect('/my-account')}>My account</MenuItem>
                                    <MenuItem onClick={() => handleRedirect('/my-trips')}>My trips</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => router.push('/login')}>
                                    Login
                                </Button>
                                <Button color="inherit" onClick={() => router.push('/signup')}>
                                    Signup
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Navbar;
