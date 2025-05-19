import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, EmailOutlined as EmailOutlinedIcon, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { IconButton, Alert, Box, Container, Typography, TextField, Button, Paper, Link, InputAdornment, } from '@mui/material';

import { register } from '../../slices/userSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector((state) => state.user); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        };
        dispatch(register(userData));
    };

    const togglePasswordVisibility = () => {
      setPasswordVisible((prev) => !prev);
    };

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]); 

    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'secondary.main',
          p: 3, 
        }}
      >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            borderRadius: 5,
            bgcolor: 'common.white'
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
          >
            Create an Account
          </Typography>
          <Box
            sx={{
              height: '2px',
              width: '40px',
              bgcolor: 'primary.main',
              borderRadius: 1,
              mx: 'auto',
              mt: 2,
              mb: 1
            }}
          />
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: 'secondary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={passwordVisible ? 'text' : 'password'} 
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'secondary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'secondary.main', mx: 1 }}
                      disableRipple
                    >
                      {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                mt: 2,
                mb: 4,
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'secondary.main',
                },
              }}
            >
              {loading ? 'Creating your account...' : 'Join Now'}
            </Button>
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: 'secondary.main' 
              }}
            >
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: '700',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
