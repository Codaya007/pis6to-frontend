import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
        <CircularProgress />
    </Box>
);

export default Loading;
