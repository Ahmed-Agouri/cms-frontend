import { useState } from 'react';
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
} from '@mantine/core';

export function ComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Complaint title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    setTimeout(() => {
      console.log('Complaint submitted:', formData);
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
      });
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 500);
  };

  return (
    <Container size="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 100px)', paddingTop: '2rem' }}>
      <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: '100%', maxWidth: '500px' }}>
        <Stack gap="lg">
          <div>
            <Title order={1} mb="xs" style={{ textAlign: 'center' }}>
              Submit a Complaint
            </Title>
            <Text c="dimmed" size="sm" style={{ textAlign: 'center' }}>
              Please fill out the form below to submit your complaint. All fields are required.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Complaint Title"
                placeholder="Enter a brief title for your complaint"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />

              <Textarea
                label="Description"
                placeholder="Provide detailed information about your complaint"
                required
                minRows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
              />

              <Select
                label="Category"
                placeholder="Select a category"
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
              />

              <Select
                label="Priority"
                placeholder="Select priority level"
                required
                data={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]}
                value={formData.priority}
                onChange={(value) => handleChange('priority', value)}
                error={errors.priority}
              />

              <Button
                type="submit"
                fullWidth
                mt="md"
                size="md"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </Button>

              {showSuccess && (
                <Text c="green" size="sm" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  Complaint submitted successfully! Check the console for details.
                </Text>
              )}
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}