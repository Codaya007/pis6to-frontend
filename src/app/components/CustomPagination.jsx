import React from 'react';
import { Box, Pagination } from '@mui/material';

const CustomPagination = ({ skip, limit, totalCount, onPageChange }) => {
    const pageCount = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    const handlePageChange = (event, value) => {
        onPageChange((value - 1) * limit);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
            />
        </Box>
    );
};

export default CustomPagination;
