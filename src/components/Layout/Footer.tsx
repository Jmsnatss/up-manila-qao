import React from 'react';
import { Box, Container, Grid, Typography, Link, styled } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#0A0F1C',
  color: 'white',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const SocialIcon = styled(Box)({
  display: 'flex',
  gap: '1rem',
  '& > a': {
    color: 'white',
    '&:hover': {
      color: '#FFB81C',
    },
  },
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img 
                src="/images/dash_logo.png" 
                alt="QAO Logo" 
                style={{ height: '60px', marginRight: '1rem' }}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              4th Floor, 411-412. National Engineering Center, University of the Philippines, Diliman.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              qa.upd@up.edu.ph
            </Typography>
            <Typography variant="body2">
              (02) 9891-8500 local 2092
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFB81C' }}>
              Userful Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="https://up.edu.ph/">UP System</FooterLink>
              <FooterLink href="https://upd.edu.ph/">UP Diliman</FooterLink>
              <FooterLink href="#">Office of the Chancellor</FooterLink>
              <FooterLink href="#">Office of the Registrar</FooterLink>
              <FooterLink href="#">Academic Affairs</FooterLink>
              <FooterLink href="#">Community Affairs</FooterLink>
              <FooterLink href="#">Research and Development</FooterLink>
              <FooterLink href="#">Student Affairs</FooterLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFB81C' }}>
              Sitemap
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/learning">Learning</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </Box>
            <Box sx={{ mt: 3 }}>
              <SocialIcon>
                <Link href="#" target="_blank">
                  <FacebookIcon />
                </Link>
                <Link href="#" target="_blank">
                  <LinkedInIcon />
                </Link>
                <Link href="mailto:qa.upd@up.edu.ph">
                  <EmailIcon />
                </Link>
              </SocialIcon>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
