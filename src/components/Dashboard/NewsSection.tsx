import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { endpoints, fetchApi } from '../../services/api';

interface News {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface NewsSectionProps {
  refreshTrigger?: number;
}

const NewsSection: React.FC<NewsSectionProps> = ({ refreshTrigger = 0 }) => {
  const [news, setNews] = useState<News[]>([]);
  const [error, setError] = useState<string>('');

  const fetchNews = async () => {
    try {
      const data = await fetchApi(`${endpoints.announcements}?category=news`);
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      setNews(data);
      setError('');
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error instanceof Error ? error.message : 'Failed to load news');
    }
  };

  useEffect(() => {
    fetchNews();
  }, [refreshTrigger]); // Refresh when trigger changes

  useEffect(() => {
    // Auto-refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Keep this separate for auto-refresh

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Latest News
      </Typography>
      <List>
        {news.map((item, index) => (
          <React.Fragment key={item._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Chip
                      label={item.category}
                      size="small"
                      color="primary"
                      sx={{ backgroundColor: '#8B0000' }}
                    />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                    {item.content}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < news.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
        {news.length === 0 && (
          <ListItem>
            <ListItemText primary="No news available" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default NewsSection;
