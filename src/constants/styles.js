/**
 * Style constants for columns and cards
 */
export const COLUMN_STYLE = {
  bgcolor: '#EBECF0', // Nền xám nhạt giống Trello
  borderRadius: '8px',
  p: 1, // Padding 8px, bao gồm padding-bottom
  minWidth: '272px',
  maxWidth: '272px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
};

export const COLUMN_HEADER_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 0.5, // Giảm từ 8px xuống 4px
};

export const CARD_PAPER_STYLE = {
  p: 2,
  mb: 1,
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 1,
};