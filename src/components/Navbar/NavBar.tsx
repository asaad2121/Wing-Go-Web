import React, { useState, MouseEvent } from 'react';
import { Adb as AdbIcon, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem, IconButton, Typography, Toolbar, Box, AppBar } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { useStoreSelector } from '@/redux/store';

function NavBar() {
    const { isAuthenticated } = useStoreSelector((state) => state.authReducer.value);
    // const isNotMobile = useMediaQuery('(min-width:450px)');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" className={classes['wg-navbar-root']}>
                <Toolbar>
                    {isAuthenticated && (
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
                        {isAuthenticated ? (
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
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => router.push('/login')}>
                                    Login
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
