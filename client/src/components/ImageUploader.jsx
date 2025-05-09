import React, { useState, useRef } from 'react';
import { Box, Button, CircularProgress, IconButton, Paper, Typography, Grid, Divider } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Image as ImageIcon, Add as AddIcon } from '@mui/icons-material';

const ImageUploader = ({
  onFileSelect,
  onFileUpload,
  onFileDelete,
  existingImages = null,
  loading = false,
  disabled = false,
  multiple = false,
  maxImages = 6,
  validationRules = {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
}) => {
  const normalizedExistingImages = existingImages 
    ? (Array.isArray(existingImages) ? existingImages : [existingImages])
    : [];
    
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const totalImages = normalizedExistingImages.length + selectedFiles.length;
  const canAddMore = !multiple || totalImages < maxImages;

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || (!canAddMore && multiple) || (normalizedExistingImages.length > 0 && !multiple)) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || (!canAddMore && multiple) || (normalizedExistingImages.length > 0 && !multiple)) return;
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled || (!canAddMore && multiple) || (normalizedExistingImages.length > 0 && !multiple)) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        const filesToProcess = Array.from(e.dataTransfer.files);
        const validFiles = [];
        
        const availableSlots = maxImages - normalizedExistingImages.length;
        const filesToAdd = filesToProcess.slice(0, availableSlots);
        
        filesToAdd.forEach(file => {
          if (validateFile(file)) {
            validFiles.push(file);
          }
        });
        
        if (validFiles.length > 0) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
          if (onFileSelect) onFileSelect(multiple ? validFiles : validFiles[0]);
        }
      } else {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          setSelectedFiles([file]);
          if (onFileSelect) onFileSelect(file);
        }
      }
    }
  };

  const validateFile = (file) => {
    if (!validationRules.allowedTypes.includes(file.type)) {
      setFileError(`File type not supported. Please use: ${validationRules.allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`);
      return false;
    }
    if (file.size > validationRules.maxSize) {
      setFileError(`File too large. Maximum size: ${Math.floor(validationRules.maxSize / (1024 * 1024))}MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    setFileError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        const filesToProcess = Array.from(e.target.files);
        const validFiles = [];
        
        const availableSlots = maxImages - normalizedExistingImages.length;
        const filesToAdd = filesToProcess.slice(0, availableSlots);
        
        filesToAdd.forEach(file => {
          if (validateFile(file)) {
            validFiles.push(file);
          }
        });
        
        if (validFiles.length > 0) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
          if (onFileSelect) onFileSelect(multiple ? validFiles : validFiles[0]);
        }
      } else {
        const file = e.target.files[0];
        if (validateFile(file)) {
          setSelectedFiles([file]);
          if (onFileSelect) onFileSelect(file);
        }
      }
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && onFileUpload) {
      if (multiple) {
        selectedFiles.forEach(file => onFileUpload(file));
      } else {
        onFileUpload(selectedFiles[0]);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFiles([]);
      setFileError(null);
    }
  };

  const handleRemoveSelected = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (image, index) => {
    if (onFileDelete) {
      onFileDelete(image, index);
    }
  };

  const renderExistingImages = () => {
    if (normalizedExistingImages.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ my: 1 }}>
          {multiple ? 'Current Images' : 'Current Image'}
        </Typography>
        <Divider sx={{ mb: 3  }} />
        <Grid container spacing={2}>
          {normalizedExistingImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={`existing-${index}`}>
              <Paper
                elevation={2}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  height: 180,
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.name || "Uploaded image"}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {onFileDelete && (
                  <IconButton
                    aria-label="delete image"
                    onClick={() => handleRemoveExisting(image, index)}
                    disabled={loading || disabled}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                      },
                      boxShadow: 1
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderSelectedFiles = () => {
    if (selectedFiles.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ my: 1 }}>
          {multiple ? 'Selected Images' : 'Selected Image'}
        </Typography>
        <Divider sx={{ mb: 3  }} />
        <Grid container spacing={2}>
          {selectedFiles.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={`selected-${index}`}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  position: 'relative',
                  height: '100%'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                      <Typography 
                        variant="body2" 
                        noWrap 
                        title={file.name}
                        sx={{ fontWeight: 500 }}
                      >
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveSelected(index)}
                      disabled={loading || disabled}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 1
                    }}
                  >
                    <Box 
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      sx={{ 
                        maxWidth: '100%', 
                        maxHeight: 100,
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderUploadArea = () => {
    if (!multiple && normalizedExistingImages.length > 0 && selectedFiles.length === 0) {
      return null;
    }
    
    if (selectedFiles.length > 0) {
      return (
        <>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpload}
            disabled={loading || disabled || fileError || selectedFiles.length === 0}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            sx={{ mt: 2, mb: multiple ? 3 : 0 }}
          >
            {loading ? 'Uploading...' : (multiple ? 'Upload Images' : 'Upload Image')}
          </Button>
          
          {multiple && canAddMore && renderDropArea()}
        </>
      );
    }
    
    if (!canAddMore) {
      return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Maximum number of images reached ({maxImages})
        </Typography>
      );
    }
    return renderDropArea();
  };
  
  const renderDropArea = () => {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'background.default',
          position: 'relative',
          mt: normalizedExistingImages.length > 0 ? 3 : 0
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'divider',
            borderRadius: 1,
            py: 3,
            px: 2,
            bgcolor: isDragging ? 'action.hover' : 'transparent',
            transition: 'all 0.2s ease'
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1.5 }} />
          <Typography variant="body1" align="center" gutterBottom>
            {isDragging 
              ? 'Drop image here' 
              : `Drag and drop ${multiple ? 'images' : 'an image'} or click to browse`
            }
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" sx={{ mb: 2 }}>
            {multiple ? `You can add up to ${maxImages - totalImages} more ${maxImages - totalImages === 1 ? 'image' : 'images'}` : ''}
            {multiple && <br />}
            Supported formats: {validationRules.allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
          </Typography>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            disabled={loading || disabled}
            startIcon={multiple ? <AddIcon /> : null}
          >
            {multiple ? 'Add Images' : 'Select File'}
            <input
              ref={fileInputRef}
              type="file"
              accept={validationRules.allowedTypes.join(',')}
              hidden
              onChange={handleFileChange}
              disabled={loading || disabled}
              multiple={multiple}
            />
          </Button>
        </Box>
        {fileError && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {fileError}
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Box>
      {renderExistingImages()}
      {renderSelectedFiles()}
      {renderUploadArea()}
    </Box>
  );
};

export default ImageUploader;