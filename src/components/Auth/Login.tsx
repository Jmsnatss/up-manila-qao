import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { endpoints, fetchApi } from '../../services/api';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  background: `url('/images/background.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  padding: theme.spacing(3),
}));

const HeaderLogoContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: '20px',
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    top: '10px',
    left: '10px',
    padding: '6px 12px',
  },
}));

const HeaderLogo = styled('img')(({ theme }) => ({
  height: '75px',
  width: 'auto',
  objectFit: 'contain',
  [theme.breakpoints.down('sm')]: {
    height: '50px',
  },
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '400px',
  marginRight: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    maxWidth: '85%',
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: '180px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    marginBottom: '12px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    fontSize: '0.9rem',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#8B0000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B0000',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    '&.Mui-focused': {
      color: '#8B0000',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#8B0000',
  color: 'white',
  padding: '12px',
  marginTop: '16px',
  fontWeight: 600,
  width: '100%',
  '&:hover': {
    backgroundColor: '#6B0000',
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  marginTop: '12px',
  padding: '12px',
  color: 'rgba(0, 0, 0, 0.87)',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  fontWeight: 500,
  width: '100%',
  '&:hover': {
    backgroundColor: '#f8f8f8',
    border: '1px solid #ccc',
  },
}));

const StyledCheckbox = styled(Checkbox)({
  color: '#8B0000',
  '&.Mui-checked': {
    color: '#8B0000',
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetchApi(endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response && response.token) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        if (formData.rememberMe) {
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('token', response.token);
        }

        if (response.user) {
          const userStr = JSON.stringify(response.user);
          if (formData.rememberMe) {
            localStorage.setItem('user', userStr);
          } else {
            sessionStorage.setItem('user', userStr);
          }
        }
        
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <HeaderLogoContainer>
        <HeaderLogo src="/images/Header_Logo.png" alt="QAO Header Logo" />
      </HeaderLogoContainer>
      
      <LoginCard elevation={3}>
        <Logo src="/images/Logo.png" alt="QAO Logo" />
        <Typography variant="h6" sx={{ 
          fontWeight: 500, 
          color: '#444',
          marginBottom: '24px'
        }}>
          Log in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <StyledTextField
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <StyledTextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#666' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControlLabel
            control={
              <StyledCheckbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
            }
            label="Remember me"
            sx={{ marginTop: '8px' }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              bgcolor: '#8B0000',
              '&:hover': {
                bgcolor: '#6d0000',
              },
              height: '44px'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Log In'}
          </Button>
          
          <GoogleButton
            variant="outlined"
            startIcon={<img src="/images/google.svg" alt="Google" style={{ width: 20 }} />}
          >
            Log in with Google
          </GoogleButton>
        </Box>
        
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            mt: 4, 
            textAlign: 'center',
            lineHeight: 1.6,
            fontSize: '0.875rem'
          }}
        >
          ADS stands for Authentication and Directory Service
          <br />
          ADS accounts are used to log in to various university
          <br />
          IT applications. If you have any INQUIRY OR CONCERNS or
          <br />
          need assistance with your ADS account,{' '}
          <a href="#" style={{ color: '#8B0000', textDecoration: 'none', fontWeight: 500 }}>
            contact us
          </a>
          {' '}and we'll help you get registered.
        </Typography>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
