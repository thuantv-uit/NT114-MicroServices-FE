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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import SaveIcon from '@mui/icons-material/Save';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';

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
          width: 1200,
          maxWidth: 1200,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          border: 'none',
          outline: 0,
          padding: '50px 30px 30px',
          margin: '40px auto',
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
            sx={{ fontSize: '28px', '&:hover': { color: 'error.light' } }}
            onClick={handleClose}
          />
        </Box>

        <Box sx={{ mb: 2, mt: -3, pr: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CreditCardIcon sx={{ fontSize: '28px' }} />
          <Typography variant="h6" sx={{ fontWeight: '700', fontSize: '24px' }}>
            Edit Card
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}> {/* Giảm spacing từ 3 xuống 0 */}
          <Grid xs={6}>
            <Box sx={{ mb: 4, p: '16px 0', borderRadius: '8px', backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
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
                    sx: { fontSize: '20px', borderRadius: '8px' },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '16px' },
                  }}
                />
                {/* <Box sx={{ mt: 3 }}>
                  <CardDescriptionMdEditor
                    cardDescriptionProp={formValues.description}
                    handleUpdateCardDescription={handleUpdateCardDescription}
                  />
                </Box> */}
                <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
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
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditCardPage;