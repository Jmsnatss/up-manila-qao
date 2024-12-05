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

const NewsSection = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await fetchApi(`${endpoints.announcements}?category=news`);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

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
      </List>
    </Box>
  );
};

export default NewsSection;
