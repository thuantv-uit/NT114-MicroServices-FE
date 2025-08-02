import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

/**
 * Vertical category sidebar component
 * @param {Object} props
 * @param {string} props.token - Authentication token to control visibility
 * @returns {JSX.Element}
 */
const CategorySidebar = ({ token }) => {
  // Placeholder categories; replace with actual content later
  const categories = [
    { id: 1, name: 'Category 1', path: '/category1' },
    { id: 2, name: 'Category 2', path: '/category2' },
    { id: 3, name: 'Category 3', path: '/category3' },
  ];

  return (
    <Box
      sx={{
        width: 250, // Fixed width for the sidebar
        height: 'calc(100vh - 64px)', // Full height minus Navbar height
        position: 'fixed',
        top: '64px', // Offset to start below Navbar (default AppBar height)
        left: 0,
        backgroundColor: '#FFFFFF', // White background to match Navbar
        borderRight: '1px solid #E0E0E0', // Dividing line on the right
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        zIndex: 1100, // Below Navbar (zIndex: 1200)
        display: token ? 'block' : 'none', // Show only if user is authenticated
      }}
    >
      <Typography
        variant="h6"
        sx={{ padding: '16px', fontWeight: 'bold', color: '#000000' }}
      >
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton component="a" href={category.path}>
              <ListItemText primary={category.name} sx={{ color: '#000000' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategorySidebar;