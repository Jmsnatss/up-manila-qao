import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  Modal,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { endpoints, getToken, fetchApi } from '../../services/api';

interface AnnouncementCarouselProps {
  refreshTrigger?: number;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  createdBy: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const AnnouncementCarousel: React.FC<AnnouncementCarouselProps> = ({ refreshTrigger = 0 }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const theme = useTheme();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(endpoints.announcements);
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
  }, [refreshTrigger]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      if (announcements.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [announcements.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  }, [announcements.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
  }, [announcements.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
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

  const handleViewMedia = (mediaUrl: string) => {
    setSelectedMedia(`${endpoints.mediaBaseUrl}${mediaUrl}`);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMedia(null);
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  if (announcements.length === 0) {
    return <Box>No announcements available</Box>;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 2, 
          fontWeight: 'medium',
          color: '#333'
        }}
      >
        Announcements
      </Typography>
      <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
        <Card sx={{ height: '100%' }}>
          {currentAnnouncement.mediaUrl && (
            <Box sx={{ position: 'relative', height: '300px' }}>
              <CardMedia
                component="img"
                image={`${endpoints.mediaBaseUrl}${currentAnnouncement.mediaUrl}`}
                alt={currentAnnouncement.title}
                sx={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: 'black',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewMedia(currentAnnouncement.mediaUrl!)}
              />
            </Box>
          )}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {currentAnnouncement.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentAnnouncement.content}
            </Typography>
          </CardContent>
        </Card>

        {/* Navigation Arrows */}
        <IconButton
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handlePrevious}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handleNext}
        >
          <NavigateNextIcon />
        </IconButton>

        {/* Navigation Dots */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {announcements.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                '&:hover': {
                  bgcolor: index === currentIndex ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.8)',
                },
              }}
            />
          ))}
        </Box>

        {/* Edit/Delete buttons */}
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => {
              setEditId(currentAnnouncement._id);
              setEditTitle(currentAnnouncement.title);
              setEditContent(currentAnnouncement.content);
              setEditDialogOpen(true);
            }}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this announcement?')) {
                handleDelete(currentAnnouncement._id);
              }
            }}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Media Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="view-media-modal"
        >
          <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'black',
            boxShadow: 24,
            p: 2,
            outline: 'none',
          }}>
            {selectedMedia && (
              <img
                src={selectedMedia}
                alt="Announcement media"
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }}
              />
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default AnnouncementCarousel;
