import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Textarea,
  Select,
  Loader,
  Group,
  Center,
  Alert,
  Badge,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { RatingModal } from './RatingModal';
import { getComplaintById, updateResolution } from '../api/complaintsApi';
import classes from './ComplaintDetailPage.module.css';

function getStatusColor(status) {
  switch (status) {
    case 'Resolved':
      return 'green';
    case 'InProgress':
      return 'yellow';
    case 'Open':
      return 'red';
    default:
      return 'gray';
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  const user = auth.user;


  const isAgent =
    new URLSearchParams(location.search).get('agent') === 'true';

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getComplaintById(id);
      setComplaint(data);

      if (isAgent) {
        setResolutionNotes(data.resolutionNotes ?? '');
        setStatus(data.status);
      }
    } catch {
      setError('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError('');

    try {
      await updateResolution(id, {
        resolutionNotes,
        assignedTo: user.name,
        status,
      });

      await loadComplaint();
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (error || !complaint) {
    return (
      <Container>
        <Alert color="red">{error || 'Complaint not found'}</Alert>
        <Button mt="md" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  const hasResolution = Boolean(complaint.resolutionNotes);
  const isResolved = complaint.status === 'Resolved';

  return (
    <Container size="xl" className={classes.container}>
      <Group mb="lg">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Title order={2}>{complaint.title}</Title>

        <Badge color={getStatusColor(complaint.status)}>
          {complaint.status}
        </Badge>
      </Group>

      <Paper p="lg" withBorder mb="lg">
        <Title order={4}>Description</Title>
        <Text mt="sm">{complaint.description}</Text>
      </Paper>

      <Paper p="lg" withBorder mb="lg">
        <Title order={4}>Resolution</Title>

        {isAgent ? (
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            minRows={5}
          />
        ) : hasResolution ? (
          <Text mt="sm">{complaint.resolutionNotes}</Text>
        ) : (
          <Text c="dimmed">No resolution yet</Text>
        )}
      </Paper>

      <Paper p="lg" withBorder>
        <Stack gap="sm">
          <Text>
            <strong>Created:</strong> {formatDate(complaint.createdAt)}
          </Text>
          <Text>
            <strong>Last Updated:</strong> {formatDate(complaint.updatedAt)}
          </Text>

          {isAgent && (
            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              data={[
                { value: 'Open', label: 'Open' },
                { value: 'InProgress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' },
              ]}
            />
          )}
        </Stack>
      </Paper>

      <Group mt="lg" justify="space-between">
        {isAgent ? (
          <Button onClick={handleSaveChanges} loading={saving}>
            Save Changes
          </Button>
        ) : (
          hasResolution &&
          !isResolved && (
            <Button color="green" onClick={() => setRatingModalOpen(true)}>
              Confirm Resolution
            </Button>
          )
        )}
      </Group>

      <RatingModal
        opened={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={() => setRatingModalOpen(false)}
      />
    </Container>
  );
}
