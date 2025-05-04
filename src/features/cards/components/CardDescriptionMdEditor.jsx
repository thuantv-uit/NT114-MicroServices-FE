import { useEffect, useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Box from '@mui/material/Box';

function CardDescriptionMdEditor({ cardDescriptionProp, handleUpdateCardDescription }) {
  const { mode } = useColorScheme();
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp);

  // Cập nhật giá trị mô tả mỗi khi cardDescriptionProp thay đổi
  useEffect(() => {
    setCardDescription(cardDescriptionProp);
  }, [cardDescriptionProp]);

  // Mỗi khi giá trị mô tả thay đổi, gọi handleUpdateCardDescription để cập nhật form
  const handleChange = (value) => {
    setCardDescription(value);
    handleUpdateCardDescription(value);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box data-color-mode={mode}>
        <MDEditor
          value={cardDescription}
          onChange={handleChange}
          previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
          height={500}
          preview="edit"
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          textareaProps={{
            style: {
              resize: 'none', // Ngăn thay đổi kích thước
              overflowY: 'auto', // Thanh cuộn nếu nội dung dài
              maxHeight: '500px', // Giới hạn chiều cao tối đa
              minHeight: '500px', // Giữ chiều cao tối thiểu
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default CardDescriptionMdEditor;