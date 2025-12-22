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
import { createComplaint } from '../api/complaintsApi';

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
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      setShowSuccess(false);
      navigate('/complaints/my');
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

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

    if (newErrors.title) {
      titleInputRef.current?.focus();
    } else if (newErrors.description) {
      descriptionInputRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      await createComplaint(payload);

      setShowSuccess(true);
      setFormData({ category: '', title: '', description: '' });
      setErrors({});
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
        'Failed to create complaint. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Create a Complaint</Title>
          <Text c="dimmed">
            Fill in the details below to submit your complaint.
          </Text>
        </div>

        <Paper withBorder p="xl" radius="md">
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {apiError && (
                <Alert color="red" title="Error">
                  {apiError}
                </Alert>
              )}

              {showSuccess && (
                <Alert color="green" title="Success">
                  Complaint created successfully!
                </Alert>
              )}

              <Select
                label="Category"
                placeholder="Choose a category"
                required
                data={[
                  { value: 'BillingOrPayments', label: 'Billing / Payments' },
                  { value: 'ServiceQuality', label: 'Service Quality' },
                  { value: 'TechnicalIssue', label: 'Technical Issue' },
                  { value: 'AccountOrAccess', label: 'Account / Access' },
                  { value: 'ProductOrService', label: 'Product / Service' },
                  { value: 'EmployeeConduct', label: 'Employee Conduct' },
                  { value: 'DataPrivacyOrSecurity', label: 'Data Privacy / Security' },
                  { value: 'Other', label: 'Other' },
                ]}
                value={formData.category}
                onChange={(v) => handleChange('category', v)}
                error={errors.category}
              />

              <TextInput
                ref={titleInputRef}
                label="Title"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />

              <Textarea
                ref={descriptionInputRef}
                label="Description"
                required
                minRows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
              />

              <Stack align="flex-end">
                <Button.Group>
                  <Button
                    variant="outline"
                    color="red"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="green"
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Button.Group>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}
