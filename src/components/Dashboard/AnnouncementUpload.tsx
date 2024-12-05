import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { endpoints, getToken } from '../../services/api';

interface AnnouncementFormData {
  title: string;
  content: string;
  media?: File;
}

const AnnouncementUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = /^(image\/(jpeg|jpg|png|gif)|video\/mp4|application\/pdf)$/;
      if (!allowedTypes.test(file.type)) {
        setError('Only images, videos, and PDFs are allowed');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview URL for image/video
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required');
      }

      const token = getToken();
      if (!token) {
        throw new Error('Please login to create an announcement');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('content', formData.content.trim());
      if (selectedFile) {
        formDataToSend.append('media', selectedFile);
      }

      const response = await fetch(`${endpoints.announcements}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to create announcement' }));
        throw new Error(errorData.message || 'Failed to create announcement');
      }

      const data = await response.json();

      // Clear form
      setFormData({ title: '', content: '' });
      clearFile();
      setSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Announcement
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          margin="normal"
          error={Boolean(error && !formData.title)}
        />

        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          multiline
          rows={4}
          margin="normal"
          error={Boolean(error && !formData.content)}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            type="file"
            accept="image/*,video/mp4,application/pdf"
            style={{ display: 'none' }}
            id="media-upload"
            onChange={handleFileSelect}
          />
          <label htmlFor="media-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mr: 2 }}
            >
              UPLOAD MEDIA
            </Button>
          </label>

          {selectedFile && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {selectedFile.name}
                <IconButton 
                  size="small" 
                  onClick={clearFile}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
              
              {preview && selectedFile.type.startsWith('image/') && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'SUBMIT'}
        </Button>
      </form>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Announcement created successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AnnouncementUpload;
