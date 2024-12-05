import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Footer from '../Layout/Footer';

const Learning = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Learning</Typography>
        {/* Add your learning page content here */}
      </Container>
      <Footer />
    </Box>
  );
};

export default Learning;
