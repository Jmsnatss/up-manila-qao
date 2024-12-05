import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  styled
} from '@mui/material';
import Footer from '../Layout/Footer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f5f5f5',
  }
}));

const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: '#7b1113',
  }
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#7b1113', fontWeight: 600 }}>
          WE'D LOVE TO HEAR FROM YOU
        </Typography>

        <Grid container spacing={4}>
          {/* Left side - Contact Info and Map */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#7b1113' }}>
                REACH US THROUGH
              </Typography>
              
              <ContactInfoItem>
                <LocationOnIcon />
                <Typography>
                 Padre Faura St, Ermita, Manila, 1000 Metro Manila
                </Typography>
              </ContactInfoItem>

              <ContactInfoItem>
                <PhoneIcon />
                <Typography>(02) Contact Number</Typography>
              </ContactInfoItem>

              <ContactInfoItem>
                <EmailIcon />
                <Typography>qao.upm@up.edu.ph</Typography>
              </ContactInfoItem>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#7b1113' }}>
                  SOCIAL NETWORKS
                </Typography>
                <ContactInfoItem>
                  <FacebookIcon />
                  <Typography>QAOUPManila</Typography>
                </ContactInfoItem>
              </Box>
            </Box>

            {/* Google Maps iframe */}
            <Paper elevation={3} sx={{ p: 1, height: '300px', width: '100%' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.5975711197162!2d120.98166475872192!3d14.578937499999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca2898558719%3A0x98a08ed0ce3f8be1!2sU.P.%20Manila%20Main%20Building!5e0!3m2!1sen!2sph!4v1709728778408!5m2!1sen!2sph"
                style={{ border: 0, width: '100%', height: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UP Manila Main Building Location Map"
              />
            </Paper>
          </Grid>

          {/* Right side - Contact Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 3, color: '#7b1113' }}>
              Send Us A Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
              
              <StyledTextField
                fullWidth
                name="email"
                placeholder="michael@up.edu.ph"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              
              <StyledTextField
                fullWidth
                name="contactNumber"
                placeholder="Contact number"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              
              <StyledTextField
                fullWidth
                name="message"
                placeholder="Message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
              
              <Button 
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#7b1113',
                  '&:hover': {
                    backgroundColor: '#5a0c0e',
                  }
                }}
              >
                Send Message
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Contact;
