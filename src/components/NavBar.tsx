import React, { useState, ChangeEvent, MouseEvent} from 'react';
import { Adb as AdbIcon, AccountCircle, Menu as MenuIcon} from '@mui/icons-material';
import { Button, Menu, MenuItem, Switch, FormGroup, FormControlLabel, IconButton, Typography, Toolbar, Box, AppBar } from '@mui/material';
import { useRouter } from 'next/router';

function NavBar() {
  const [auth, setAuth] = useState(true);
  // const isNotMobile = useMediaQuery('(min-width:450px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {auth && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>}
          <Box flexGrow={1} sx={{display: 'flex', alignItems: 'center'}}>
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
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
          <Button color="inherit" onClick={()=> router.push('/login')}>Login</Button>
          </>
          )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Test Switch */}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup>
    </>
  );
};

export default NavBar;
