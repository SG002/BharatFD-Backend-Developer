import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

const FAQForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  
  useEffect(() => {
    if (open) {
      setFormData({
        question: initialData?.question || '',
        answer: initialData?.answer || ''
      });
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      alert('Please fill in both question and answer fields');
      return;
    }
    onSubmit(formData);
    
    setFormData({ question: '', answer: '' });
    onClose();
  };

  const handleClose = () => {
    
    setFormData({ question: '', answer: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit FAQ' : 'Create New FAQ'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2 }}>
            <Editor
              apiKey="xyz56hsikgpesm8tmnhdjghb2tdn5edev0rcc22wwsbledjd" 
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                  'help', 'wordcount', 'directionality'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | ltr rtl | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                directionality: 'auto', 
                language: 'en', 
                language_url: '/langs/en.js', 
              }}
              value={formData.answer}
              onEditorChange={(content) => setFormData({...formData, answer: content})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            color="primary"
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FAQForm; 