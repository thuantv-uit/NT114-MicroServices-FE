import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';
import { showToast } from '../utils/toastUtils';

/**
 * Vertical category sidebar component
 * @param {Object} props
 * @param {string} props.token - Authentication token to control visibility
 * @param {Function} props.logout - Logout function
 * @param {boolean} props.isOpen - State indicating if the sidebar is open
 * @param {Function} props.toggleSidebar - Function to toggle the sidebar visibility
 * @returns {JSX.Element}
 */
const CategorySidebar = ({ token, logout, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
      navigate('/login');
    } else {
      console.error('Logout is not a function');
      showToast('Unable to logout. Please try again.', 'error');
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // eslint-disable-next-line no-unused-vars
  const handlePlaceholderClick = (itemName) => {
    console.log(`${itemName} clicked - implement custom logic here`);
    // Replace with actual navigation or functionality as needed
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        width: 250,
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        top: '64px',
        left: 0,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E0E0E0',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Close button at the top */}
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon><DashboardIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem>
        {/* Project (Expandable) */}
        <Accordion expanded={expanded === 'project'} onChange={handleChange('project')} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
            <ListItemIcon><FolderIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <Typography sx={{ ml: -2 }}>Project</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List component="div" disablePadding>
              <ListItem disablePadding sx={{ pl: 4 }}>
                <ListItemButton component={Link} to="/boards">
                  <ListItemText primary="Board" sx={{ color: '#000000' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </List>
      {/* Logout at the bottom */}
      <List>
        <ListItem disablePadding sx={{ borderTop: '1px solid #E0E0E0' }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default CategorySidebar;