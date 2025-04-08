import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getListById } from '../../api/listApi';
import CardList from '../card/CardList';
import CreateCard from '../card/CreateCard';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Divider,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ListDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // listId
  const [list, setList] = useState(null);
  const [setCards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const listData = await getListById(token, id);
        setList(listData);
      } catch (err) {
        setError('Không thể tải thông tin list');
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchList();
  }, [token, id]);

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!list) return <Typography>Không tìm thấy list</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Thông tin List */}
        <Card elevation={3} sx={{ mb: 2 }}>
          <CardHeader
            title={list.title}
            titleTypographyProps={{ variant: 'h4' }}
            subheader={`ID: ${list._id} | Thuộc Board: ${list.boardId} | Vị trí: ${list.position}`}
            subheaderTypographyProps={{ variant: 'body1' }}
          />
          <CardContent>
            {/* Bạn có thể thêm nội dung bổ sung vào đây nếu cần */}
          </CardContent>
        </Card>

        {/* Danh sách Cards */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Danh sách Cards
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <CardList listId={id} token={token} />
        </Box>

        {/* Tạo Card mới */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Tạo Card mới
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <CreateCard listId={id} token={token} setCards={setCards} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ListDetail;