import React, { useState, MouseEvent, useEffect } from 'react';
import { Adb as AdbIcon, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem, IconButton, Typography, Toolbar, Box, AppBar } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { useAppDispatch, useStoreSelector } from '@/redux/store';
import { logOut } from '@/redux/features/auth/auth-slice';
import { snackbar } from '../Snackbar/Snackbar';

function NavBar() {
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
    };

    const handleLogout = () => {
        dispatch(logOut());
        snackbar.info('Logged out successfully', 5000);
    };

    return (
        <>
            <AppBar position="static" className={classes['wg-navbar-root']}>
                <Toolbar>
                    {auth && (
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box flexGrow={1} display={'flex'} alignItems={'center'}>
                        <AdbIcon />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            WingGo
                        </Typography>
                    </Box>
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
                                    <MenuItem onClick={() => handleRedirect('/settings')}>Settings</MenuItem>
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

export default NavBar;
