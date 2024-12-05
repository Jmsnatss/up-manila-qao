import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Button } from '@mui/material';
import AnnouncementCarousel from './AnnouncementCarousel';
import AnnouncementUpload from './AnnouncementUpload';
import NewsSection from './NewsSection';
import Footer from '../Layout/Footer';

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
    }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowUpload(!showUpload)}
              >
                {showUpload ? 'Hide Upload Form' : 'Create Announcement'}
              </Button>
            </Box>
            {showUpload && (
              <AnnouncementUpload 
                onUploadSuccess={handleUploadSuccess}
              />
            )}
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <AnnouncementCarousel refreshTrigger={refreshTrigger} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <NewsSection refreshTrigger={refreshTrigger} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Dashboard;
