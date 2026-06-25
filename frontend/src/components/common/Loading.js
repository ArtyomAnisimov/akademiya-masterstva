/**
 * Компонент индикатора загрузки
 */

import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = ({ message = 'Загрузка...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;