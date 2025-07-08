import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // Dữ liệu cho các Select và các option
  const menuItems = [
    {
      label: 'Feature',
      options: [
        { label: 'Feature 1', path: '/feature/1' },
        { label: 'Feature 2', path: '/feature/2' },
        { label: 'Feature 3', path: '/feature/3' },
      ],
    },
    {
      label: 'Solutions',
      options: [
        { label: 'Solution A', path: '/solutions/a' },
        { label: 'Solution B', path: '/solutions/b' },
      ],
    },
    {
      label: 'Plans',
      options: [
        { label: 'Basic Plan', path: '/plans/basic' },
        { label: 'Pro Plan', path: '/plans/pro' },
      ],
    },
    {
      label: 'Prices',
      options: [
        { label: 'Pricing Tier 1', path: '/prices/tier1' },
        { label: 'Pricing Tier 2', path: '/prices/tier2' },
      ],
    },
    {
      label: 'Resources',
      options: [
        { label: 'Blog', path: '/resources/blog' },
        { label: 'Tutorials', path: '/resources/tutorials' },
        { label: 'Docs', path: '/resources/docs' },
      ],
    },
  ];

  // State để lưu giá trị của mỗi Select
  const [selectedValues, setSelectedValues] = React.useState(
    menuItems.reduce((acc, menu) => ({ ...acc, [menu.label]: '' }), {})
  );

  // Xử lý khi chọn option
  const handleChange = (menuLabel, event) => {
    const path = event.target.value;
    setSelectedValues((prev) => ({ ...prev, [menuLabel]: path }));
    if (path) {
      navigate(path);
    }
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ border: 'none' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo và tên Thunio ở góc trái, to hơn và in đậm */}
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img
            src="https://www.svgrepo.com/show/354463/trello.svg"
            alt="Thunio Logo"
            style={{ width: 32, height: 32, marginRight: 8 }}
          />
          <Typography
            variant="h5" // Tăng từ h6 lên h5
            sx={{ color: 'inherit', fontWeight: 'bold' }} // In đậm
          >
            Thunio
          </Typography>
        </Box>

        {/* Các Select ở giữa, dịch về bên trái một chút */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ml: -2 }}>
          {menuItems.map((menu, index) => (
            <Select
              key={menu.label}
              value={selectedValues[menu.label]}
              onChange={(e) => handleChange(menu.label, e)}
              displayEmpty
              renderValue={(selected) =>
                selected ? selected.split('/').pop() : menu.label
              }
              variant="standard"
              sx={{
                minWidth: 80,
                '& .MuiSelect-select': {
                  py: 0.5,
                  pr: 0,
                },
                '&:before, &:after': { borderBottom: 'none' },
                mr: index === menuItems.length - 1 ? 0 : 2,
              }}
              IconComponent={(props) => (
                <span
                  style={{
                    marginLeft: -8,
                    fontSize: '1rem',
                  }}
                  {...props}
                />
              )}
            >
              <MenuItem value="" disabled>
                {menu.label}
              </MenuItem>
              {menu.options.map((option) => (
                <MenuItem key={option.path} value={option.path}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          ))}
        </Box>

        {/* Nút Sign In và Sign Up ở góc phải */}
        <Box>
          <Button color="primary" component={Link} to="/login" sx={{ mr: 1 }}>
            Sign In
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/register"
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;