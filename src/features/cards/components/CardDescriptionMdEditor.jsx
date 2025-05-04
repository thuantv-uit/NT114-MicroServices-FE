import { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';

function CardDescriptionMdEditor({ cardDescriptionProp, handleUpdateCardDescription }) {
  const { mode } = useColorScheme();
  const [markdownEditMode, setMarkdownEditMode] = useState(false);
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp);

  const updateCardDescription = () => {
    setMarkdownEditMode(false);
    handleUpdateCardDescription(cardDescription);
  };

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={500} // Tăng chiều cao để khung lớn hơn
              preview="edit"
              style={{
                borderRadius: '12px', // Bo góc mềm mại hơn
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Thêm bóng
              }}
            />
          </Box>
          <Button
            sx={{
              alignSelf: 'flex-end',
              fontSize: '16px',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
            onClick={updateCardDescription}
            className="interceptor-loading"
            type="button"
            variant="contained"
            color="primary" // Đổi màu để nổi bật hơn
            size="medium"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{
              alignSelf: 'flex-end',
              fontSize: '16px',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
            onClick={() => setMarkdownEditMode(true)}
            type="button"
            variant="contained"
            color="info"
            size="medium"
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '16px' : '0px', // Tăng padding
                border: cardDescription ? '1px solid rgba(0, 0, 0, 0.15)' : 'none',
                borderRadius: '12px', // Bo góc lớn hơn
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Thêm bóng
                minHeight: '150px', // Đảm bảo khung có chiều cao tối thiểu
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CardDescriptionMdEditor;