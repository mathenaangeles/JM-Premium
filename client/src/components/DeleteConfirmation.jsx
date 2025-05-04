import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Backdrop, } from '@mui/material';

const DeleteConfirmationModal = ({ open, onConfirm, onCancel, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{
        sx: {
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: 8,
          p: 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            Confirm Deletion
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{ color: 'common.grey' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider/>
      <DialogContent>
        <Typography variant="body1">{message}{' '}<b>This action cannot be undone.</b></Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onConfirm} variant="outlined" color="error">
          Confirm
        </Button>
        <Button onClick={onCancel} variant="contained" color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;