/**
 * Style constants for columns and cards
 */
export const COLUMN_STYLE = {
  minWidth: '300px',
  maxWidth: '300px',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
  ml: 2,
  borderRadius: '6px',
  height: 'fit-content',
  maxHeight: (theme) => `calc(100vh - ${theme.spacing(5)})`,
};

export const COLUMN_HEADER_STYLE = {
  height: '60px',
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const CARD_PAPER_STYLE = {
  p: 2,
  mb: 1,
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 1,
};