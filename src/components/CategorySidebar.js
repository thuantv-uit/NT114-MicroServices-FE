import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import PersonIcon from '@mui/icons-material/Person';
// import HistoryIcon from '@mui/icons-material/History';
// import StarIcon from '@mui/icons-material/Star';
// import AppsIcon from '@mui/icons-material/Apps';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
// import GroupIcon from '@mui/icons-material/Group';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
// import CloseIcon from '@mui/icons-material/Close';
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
        {/* For You */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('For You')}>
            <ListItemIcon><PersonIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="For You" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* Recent */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('Recent')}>
            <ListItemIcon><HistoryIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Recent" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* Starred */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('Starred')}>
            <ListItemIcon><StarIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Starred" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* Apps */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('Apps')}>
            <ListItemIcon><AppsIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Apps" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* Plans */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('Plans')}>
            <ListItemIcon><AssignmentIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Plans" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* Dashboard */}
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
              {/* <ListItem disablePadding sx={{ pl: 4 }}>
                <ListItemButton component={Link} to="/projects/start">
                  <ListItemText primary="Start" sx={{ color: '#000000' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ pl: 4 }}>
                <ListItemButton component={Link} to="/projects/current">
                  <ListItemText primary="Current" sx={{ color: '#000000' }} />
                </ListItemButton>
              </ListItem> */}
              <ListItem disablePadding sx={{ pl: 4 }}>
                <ListItemButton component={Link} to="/boards">
                  <ListItemText primary="Board" sx={{ color: '#000000' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        {/* Teams */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('Teams')}>
            <ListItemIcon><GroupIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="Teams" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
        {/* More */}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => handlePlaceholderClick('More')}>
            <ListItemIcon><MoreHorizIcon sx={{ color: '#000000' }} /></ListItemIcon>
            <ListItemText primary="More" sx={{ color: '#000000' }} />
          </ListItemButton>
        </ListItem> */}
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