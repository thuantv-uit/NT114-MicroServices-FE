/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCard, fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { validateCardForm } from '../../../utils/validateUtils';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // Tăng khoảng cách giữa icon và text
  cursor: 'pointer',
  fontSize: '16px', // Tăng font size
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#f5f6fa',
  padding: '12px 16px', // Tăng padding để nút lớn hơn
  borderRadius: '6px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Thêm bóng nhẹ
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : '#e0e4ff',
    transform: 'translateY(-2px)', // Hiệu ứng nâng lên khi hover
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)', // Tăng bóng khi hover
  },
}));

const EditCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || '';
  const [formValues, setFormValues] = useState({
    title: state?.title || '',
    description: state?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      if (!token) {
        showToast('Authentication token is missing', 'error');
        navigate(`/boards/${boardId}`);
        return;
      }
      setLoading(true);
      try {
        const cards = await fetchCards(columnId);
        const card = cards.find((c) => c._id === cardId);
        if (card) {
          setFormValues({ title: card.title, description: card.description || '' });
        } else {
          showToast('Card not found', 'error');
          navigate(`/boards/${boardId}`);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load card', 'error');
        navigate(`/boards/${boardId}`);
      } finally {
        setLoading(false);
      }
    };
    if (!state?.title && columnId) {
      loadCard();
    }
  }, [cardId, columnId, boardId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    const validationErrors = validateCardForm({ ...formValues, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleUpdateCardDescription = (newDescription) => {
    setFormValues((prev) => ({ ...prev, description: newDescription }));
    const validationErrors = validateCardForm({ ...formValues, description: newDescription });
    setErrors((prev) => ({ ...prev, description: validationErrors.description }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCardForm(formValues);
    setErrors(validationErrors);
    // if (Object.keys(validationErrors).length > 0) {
    //   showToast('Please fix the errors in the form', 'error');
    //   return;
    // }
    if (!token) {
      showToast('Authentication token is missing', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateCard(cardId, formValues.title, formValues.description);
      showToast('Card updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to update card', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <Modal
      disableScrollLock
      open={true}
      onClose={handleClose}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 950, // Tăng width để khung lớn hơn
          maxWidth: 950,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // Tăng bóng để tạo chiều sâu
          borderRadius: '12px', // Bo góc lớn hơn
          border: 'none',
          outline: 0,
          padding: '50px 30px 30px', // Tăng padding để thoáng hơn
          margin: '40px auto', // Giảm margin top/bottom để cân đối
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            cursor: 'pointer',
          }}
        >
          <CancelIcon
            color="error"
            sx={{ fontSize: '28px', '&:hover': { color: 'error.light' } }} // Tăng kích thước icon đóng
            onClick={handleClose}
          />
        </Box>

        <Box sx={{ mb: 2, mt: -3, pr: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CreditCardIcon sx={{ fontSize: '28px' }} /> {/* Tăng kích thước icon */}
          <Typography variant="h6" sx={{ fontWeight: '700', fontSize: '24px' }}>
            Edit Card
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Left side: Form */}
          <Grid xs={12} sm={8.5}>
            <Box sx={{ mb: 4, p: 2, borderRadius: '8px', backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <SubjectRoundedIcon sx={{ fontSize: '26px' }} />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '22px' }}>
                  Card Details
                </Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Card Title"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  margin="normal"
                  required
                  disabled={loading}
                  InputProps={{
                    sx: { fontSize: '16px', borderRadius: '8px' },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '16px' },
                  }}
                />
                <Box sx={{ mt: 3 }}>
                  <CardDescriptionMdEditor
                    cardDescriptionProp={formValues.description}
                    handleUpdateCardDescription={handleUpdateCardDescription}
                  />
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{
                      fontSize: '16px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    Update Card
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClose}
                    disabled={loading}
                    startIcon={<CancelIcon />}
                    sx={{
                      fontSize: '16px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </form>
            </Box>
          </Grid>

          {/* Right side: Actions */}
          <Grid xs={12} sm={3.5}>
            <Typography sx={{ fontWeight: '600', fontSize: '18px', color: 'primary.main', mb: 2 }}>
              Actions
            </Typography>
            <Stack direction="column" spacing={1.5}>
              <SidebarItem onClick={() => navigate(`/boards/${boardId}`)}>
                <ArrowBackIcon fontSize="medium" />
                Back to Board
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditCardPage;