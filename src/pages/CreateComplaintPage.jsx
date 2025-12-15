import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Title,
  Text,
  Alert,
} from '@mantine/core';


async function submitComplaintToApi(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('API Call - Complaint Data:', payload);
      resolve({
        success: true,
        id: `COMP-${Date.now()}`,
        message: 'Complaint created successfully',
      });
    }, 1000);
  });
}


export function CreateComplaintPage() {
  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);

    if (newErrors.title && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (newErrors.description && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);
    setApiError('');

    try {
      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      const response = await submitComplaintToApi(payload);

      if (response.success) {
        setShowSuccess(true);

        setFormData({
          category: '',
          title: '',
          description: '',
        });
        setErrors({});

      } else {
        setApiError(response.message || 'Failed to create complaint. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setApiError(
        error.message || 'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
    });
    setErrors({});
    setApiError('');
    setShowSuccess(false);
    navigate(-1);
  };

  return (
    <Container size="lg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Stack gap="xl">
        <div>
          <Title order={1} c="blue" style={{ marginBottom: '0.5rem' }}>
            Create a Complaint
          </Title>
          <Text c="dimmed" size="md">
            Fill in the details below to create a new complaint.
          </Text>
        </div>

        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          withBorder
          style={{
            backgroundColor: '#f8f9fa',
            borderColor: '#dee2e6',
            width: '100%',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {apiError && (
                <Alert color="red" title="Error" onClose={() => setApiError('')} withCloseButton>
                  {apiError}
                </Alert>
              )}

              {showSuccess && (
                <Alert color="green" title="Success" onClose={() => setShowSuccess(false)} withCloseButton>
                  Complaint created successfully!
                </Alert>
              )}

              <Select
                label="Category"
                placeholder="Choose a Category"
                required
                data={[
                  { value: 'Billing', label: 'Billing' },
                  { value: 'Service', label: 'Service' },
                  { value: 'Technical', label: 'Technical' },
                  { value: 'Other', label: 'Other' },
                ]}
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                error={errors.category}
                aria-label="Select complaint category"
              />

              <TextInput
                ref={titleInputRef}
                label="Title"
                placeholder="Enter a short summary of your problem..."
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                aria-label="Enter complaint title"
              />

              <Textarea
                ref={descriptionInputRef}
                label="Description"
                placeholder="Provide a detailed description of the issue..."
                required
                minRows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                aria-label="Enter complaint description"
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  color="red"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="green"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="md"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}