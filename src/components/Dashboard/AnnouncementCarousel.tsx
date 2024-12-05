import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  DeleteOutline,
  Edit,
} from '@mui/icons-material';
import { endpoints, getToken, fetchApi } from '../../services/api';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  createdBy: string;
}

const AnnouncementCarousel: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const theme = useTheme();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(endpoints.announcements);
      console.log('Fetched announcements:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      setAnnouncements(data);
      setError('');
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError(error instanceof Error ? error.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await fetchApi(`${endpoints.announcements}/${id}`, {
        method: 'DELETE',
      });

      // Remove the deleted announcement from the state
      setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
      
      // Adjust currentIndex if necessary
      if (announcements.length <= 1) {
        setCurrentIndex(0);
      } else if (currentIndex >= announcements.length - 1) {
        setCurrentIndex(Math.max(0, announcements.length - 2));
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditId(announcement._id);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;

    try {
      const updatedAnnouncement = await fetchApi(`${endpoints.announcements}/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });
      
      setAnnouncements(prev => 
        prev.map(ann => 
          ann._id === editId ? { ...ann, title: editTitle, content: editContent } : ann
        )
      );
      
      setEditDialogOpen(false);
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      setError('');
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError(error instanceof Error ? error.message : 'Failed to update announcement');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={fetchAnnouncements}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No announcements available
        </Typography>
      </Card>
    );
  }

  const currentAnnouncement = announcements[currentIndex];
  const mediaUrl = currentAnnouncement.mediaUrl?.startsWith('http') 
    ? currentAnnouncement.mediaUrl 
    : `http://localhost:5001${currentAnnouncement.mediaUrl}`;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 1
      }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 500 }}>
          Announcements
        </Typography>
      </Box>

      <Card sx={{ position: 'relative', minHeight: 400 }}>
        {mediaUrl && (
          <>
            {mediaUrl.match(/\.(mp4)$/i) ? (
              <Box sx={{ 
                height: 300, 
                bgcolor: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                '& video': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }
              }}>
                <video
                  key={mediaUrl}
                  src={mediaUrl}
                  controls
                />
              </Box>
            ) : mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <CardMedia
                component="img"
                image={mediaUrl}
                alt={currentAnnouncement.title}
                sx={{
                  height: 300,
                  objectFit: 'contain',
                  bgcolor: 'black',
                }}
              />
            ) : null}
          </>
        )}

        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentAnnouncement.title}
          </Typography>

          <Typography variant="body1" paragraph>
            {currentAnnouncement.content}
          </Typography>

          <Typography variant="caption" color="textSecondary">
            Posted on: {new Date(currentAnnouncement.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box>
            <IconButton 
              onClick={() => handleDelete(currentAnnouncement._id)}
              color="error"
              size="small"
            >
              <DeleteOutline />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(currentAnnouncement)}
            >
              <Edit />
            </IconButton>
          </Box>

          {announcements.length > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handlePrev} size="small">
                <KeyboardArrowLeft />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                {currentIndex + 1} of {announcements.length}
              </Typography>
              <IconButton onClick={handleNext} size="small">
                <KeyboardArrowRight />
              </IconButton>
            </Box>
          )}
        </CardActions>

        {mediaUrl?.match(/\.pdf$/i) && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View PDF
            </Button>
          </Box>
        )}
      </Card>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Announcement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementCarousel;
