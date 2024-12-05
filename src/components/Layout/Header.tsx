import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../services/api';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const navItems = [
    { label: 'HOME', path: '/dashboard' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'LEARNING', path: '/learning' },
    { label: 'EVENTS', path: '/events' },
    { label: 'CONTACT US', path: '/contact' },
  ];

  const renderNavButtons = () => {
    if (isMobile) {
      return (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        {navItems.map((item) => (
          <Button
            key={item.path}
            color="inherit"
            onClick={() => handleNavigation(item.path)}
          >
            {item.label}
          </Button>
        ))}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            border: '1px solid white',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          LOGOUT
        </Button>
      </Box>
    );
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#7b1113' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/dash_logo.png"
              alt="Logo"
              style={{
                height: '65px',
                marginRight: '1rem',
                marginBottom: '0.5rem',
                marginTop: '0.25rem',
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {renderNavButtons()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
