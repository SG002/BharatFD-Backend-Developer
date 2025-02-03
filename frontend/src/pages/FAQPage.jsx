import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { faqAPI } from '../services/api';
import FAQItem from '../components/FAQItem';
import FAQForm from '../components/FAQForm';

const FAQPage = () => {
  const [language, setLanguage] = useState('en');
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['faqs', language],
    () => faqAPI.getAll(language)
  );

  const createMutation = useMutation(faqAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs', language]);
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => faqAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['faqs', language]);
      }
    }
  );

  const deleteMutation = useMutation(faqAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs', language]);
    }
  });

  const handleSubmit = (formData) => {
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    setFormOpen(false);
    setEditingFaq(null);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">FAQs</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
              <MenuItem value="bn">Bengali</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingFaq(null);
              setFormOpen(true);
            }}
          >
            Add FAQ
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data?.faqs && data.faqs.length > 0 ? (
        data.faqs.map((faq) => (
          <FAQItem
            key={faq._id}
            faq={faq}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={true}
          />
        ))
      ) : (
        <Alert severity="info">No FAQs available</Alert>
      )}

      <FAQForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingFaq(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingFaq}
      />
    </Container>
  );
};

export default FAQPage;