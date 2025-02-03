import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import {
  ExpandMore,
  Edit,
  Delete
} from '@mui/icons-material';

const FAQItem = ({ faq, onEdit, onDelete, isAdmin = false }) => {
  const [expanded, setExpanded] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(faq);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(faq._id);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 1 }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMore />}
        sx={{
          '&.MuiAccordionSummary-root': {
            cursor: 'pointer'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          pr: 2 
        }}>
          <Typography variant="h6">{faq.question}</Typography>
          {isAdmin && (
            <Box 
              sx={{ ml: 2 }}
              onClick={e => e.stopPropagation()}
            >
              <IconButton 
                size="small" 
                onClick={handleEditClick}
                sx={{ mr: 1 }}
              >
                <Edit />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleDeleteClick}
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQItem; 