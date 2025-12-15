import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Group,
  TextInput,
  Textarea,
  Select,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { RatingModal } from './RatingModal';
import classes from './ComplaintDetailPage.module.css';

// Mock complaint data - need to replace with API call later
const getMockComplaint = (id) => {
  const baseComplaint = {
    id: id,
    reference: `#Ref-${1000 + parseInt(id) || 1001}`,
    title: 'Report false transaction',
    description:
      'I noticed a payment on my account that I did not make. The amount and recipient are unfamiliar, and it was processed on 28/11/2025.\n\nPlease investigate and reverse the transaction if possible',
    priority: 'High',
    category: 'Banking',
    created_at: '2025-11-28T14:32:00Z',
    updated_at: '2025-11-29T10:47:00Z',
    assigned_to: 'Support Team',
  };

  // 1: No resolution (Unresolved/In Progress)
  if (id === '1' || id === '1001') {
    return {
      ...baseComplaint,
      status: 'In Progress',
      resolution_notes: null,
      timeline: [
        { event: 'Complaint Submitted', timestamp: '28 Nov 2025 – 14:32' },
        { event: 'Assigned to Support Team', timestamp: '28 Nov 2025 – 15:10' },
        { event: 'Status Updated to "In Progress"', timestamp: '28 Nov 2025 – 15:22' },
      ],
    };
  }

  // 2: Has resolution, waiting for confirmation
  if (id === '2' || id === '1002') {
    return {
      ...baseComplaint,
      status: 'In Progress',
      resolution_notes:
        'We have reviewed the transaction and confirmed it was processed in error. The charge has now been reversed and a refund has been issued to your account. You should see the corrected balance within 3-5 working days',
      timeline: [
        { event: 'Complaint Submitted', timestamp: '28 Nov 2025 – 14:32' },
        { event: 'Assigned to Support Team', timestamp: '28 Nov 2025 – 15:10' },
        { event: 'Status Updated to "In Progress"', timestamp: '28 Nov 2025 – 15:22' },
        { event: 'Resolution Notes Added', timestamp: '29 Nov 2025 – 10:47' },
      ],
    };
  }

  // 3: Already resolved
  if (id === '3' || id === '1003') {
    return {
      ...baseComplaint,
      status: 'Resolved',
      resolution_notes:
        'We have reviewed the transaction and confirmed it was processed in error. The charge has now been reversed and a refund has been issued to your account. You should see the corrected balance within 3-5 working days',
      timeline: [
        { event: 'Complaint Submitted', timestamp: '28 Nov 2025 – 14:32' },
        { event: 'Assigned to Support Team', timestamp: '28 Nov 2025 – 15:10' },
        { event: 'Status Updated to "In Progress"', timestamp: '28 Nov 2025 – 15:22' },
        { event: 'Resolution Notes Added', timestamp: '29 Nov 2025 – 10:47' },
        { event: 'Resolution Confirmed by Consumer', timestamp: '29 Nov 2025 – 11:30' },
      ],
    };
  }

  // Default: 1
  return {
    ...baseComplaint,
    status: 'Unresolved',
    resolution_notes: null,
    timeline: [
      { event: 'Complaint Submitted', timestamp: '28 Nov 2025 – 14:32' },
    ],
  };
};

async function fetchComplaintById(id) {
  // need to replace with actual API endpoint later
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const complaint = getMockComplaint(id);
        resolve(complaint);
      } catch (error) {
        reject(new Error('Complaint not found'));
      }
    }, 500);
  });
}

async function confirmResolution(complaintId, rating, feedback) {
  // need to replace with actual API endpoint later

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Resolution confirmed successfully',
      });
    }, 1000);
  });
}

async function updateComplaint(complaintId, resolutionNotes, status) {
  // need to replace with actual API endpoint later
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Complaint updated successfully',
      });
    }, 1000);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} – ${hours}:${minutes}`;
}

export function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const isAgent = location.pathname.includes('/agent') || 
                  new URLSearchParams(location.search).get('agent') === 'true' ||
                  document.referrer.includes('/agent/dashboard');
  
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, [id, location]);

  const loadComplaint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComplaintById(id);
      setComplaint(data);

      if (isAgent) {
        setResolutionNotes(data.resolution_notes || '');
        setStatus(data.status);
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isAgent) {
      navigate('/agent/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleEditComplaint = () => {
    navigate(`/complaints/${id}/edit`);
  };

  const handleCancel = () => {
    handleGoBack();
  };

  const handleConfirmResolution = () => {
    setRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating, feedback) => {
    setSubmitting(true);
    try {
      await confirmResolution(id, rating, feedback);
      
      const updatedComplaint = {
        ...complaint,
        status: 'Resolved',
        timeline: [
          ...complaint.timeline,
          {
            event: 'Resolution Confirmed by Consumer',
            timestamp: formatDate(new Date().toISOString()),
          },
        ],
      };
      setComplaint(updatedComplaint);
      setRatingModalOpen(false);
    } catch (err) {
      console.error('Failed to confirm resolution:', err);
      setError('Failed to confirm resolution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateComplaint(id, resolutionNotes, status);
      
      const updatedComplaint = {
        ...complaint,
        resolution_notes: resolutionNotes,
        status: status,
        updated_at: new Date().toISOString(),
        timeline: [
          ...complaint.timeline,
          {
            event: status !== complaint.status 
              ? `Status Updated to "${status}"`
              : 'Resolution Notes Updated',
            timestamp: formatDate(new Date().toISOString()),
          },
        ],
      };
      setComplaint(updatedComplaint);
      
      setError(null);
    } catch (err) {
      console.error('Failed to update complaint:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <Container size="xl" className={classes.container}>
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error || !complaint) {
    return (
      <Container size="xl" className={classes.container}>
        <Alert color="red" title="Error" mb="md">
          {error || 'Complaint not found'}
        </Alert>
        <Button leftSection={<IconArrowLeft size={18} />} onClick={handleGoBack}>
          Go Back
        </Button>
      </Container>
    );
  }

  const hasResolution = !!complaint.resolution_notes;
  const isResolved = complaint.status === 'Resolved';

  const showState1 = !hasResolution; 
  const showState2 = hasResolution && !isResolved; 
  const showState3 = isResolved; 

  return (
    <Container size="xl" className={classes.container}>
      <div className={classes.header}>
        <Title order={1} className={classes.headerTitle}>
          Complaint: {complaint.reference}
        </Title>
      </div>

      <div className={classes.contentWrapper}>
        <div className={classes.mainContent}>
          <Paper className={classes.descriptionBox} p="lg" withBorder>
            <Title order={3} mb="md" className={classes.sectionTitle}>
              Description
            </Title>
            <Text 
              className={classes.descriptionText} 
              style={{ 
                whiteSpace: 'pre-wrap',
                color: isAgent ? '#9CA3AF' : '#374151',
              }}
            >
              {complaint.description}
            </Text>
          </Paper>

          <Paper className={classes.resolutionBox} p="lg" withBorder>
            <Title order={3} mb="md" className={classes.sectionTitle}>
              Resolution Notes
            </Title>
            {isAgent ? (
              <Textarea
                placeholder="Enter resolution notes..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                minRows={6}
                className={classes.resolutionTextarea}
              />
            ) : hasResolution ? (
              <Text className={classes.resolutionText} style={{ whiteSpace: 'pre-wrap' }}>
                {complaint.resolution_notes}
              </Text>
            ) : (
              <Text c="dimmed" className={classes.resolutionText}>
                No resolution notes yet.
              </Text>
            )}
          </Paper>

          <Paper className={classes.detailsBox} p="lg" withBorder>
            <Title order={3} mb="md" className={classes.sectionTitle}>
              Details
            </Title>
            <Stack gap="sm">
              <div className={classes.detailRow}>
                <Text fw={600} className={classes.detailLabel}>
                  Created On:
                </Text>
                <Text className={classes.detailValue}>{formatDate(complaint.created_at)}</Text>
              </div>
              <div className={classes.detailRow}>
                <Text fw={600} className={classes.detailLabel}>
                  Current Status:
                </Text>
                <Text
                  className={classes.detailValue}
                  style={{ color: getStatusColor(complaint.status) }}
                >
                  {complaint.status}
                </Text>
              </div>
              <div className={classes.detailRow}>
                <Text fw={600} className={classes.detailLabel}>
                  Assigned To:
                </Text>
                <Text className={classes.detailValue}>{complaint.assigned_to}</Text>
              </div>
              <div className={classes.detailRow}>
                <Text fw={600} className={classes.detailLabel}>
                  Last Updated:
                </Text>
                <Text className={classes.detailValue}>{formatDate(complaint.updated_at)}</Text>
              </div>
            </Stack>
          </Paper>
          <div className={classes.actionButtons}>
            {isAgent ? (
              <>
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<IconArrowLeft size={18} />}
                  onClick={handleGoBack}
                  disabled={saving}
                >
                  Go Back
                </Button>
                <Button 
                  color="blue" 
                  onClick={handleSaveChanges}
                  loading={saving}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                {showState1 && (
                  <>
                    <Button
                      variant="outline"
                      color="gray"
                      leftSection={<IconArrowLeft size={18} />}
                      onClick={handleGoBack}
                    >
                      Go Back
                    </Button>
                    <Button color="blue" onClick={handleEditComplaint}>
                      Edit Complaint
                    </Button>
                  </>
                )}

                {showState2 && (
                  <>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button color="green" onClick={handleConfirmResolution}>
                      Confirm Resolution
                    </Button>
                  </>
                )}

                {showState3 && (
                  <Button
                    variant="outline"
                    color="gray"
                    leftSection={<IconArrowLeft size={18} />}
                    onClick={handleGoBack}
                  >
                    Go Back
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <div className={classes.sidebar}>
          <Paper className={classes.timelineBox} p="lg" withBorder>
            <Title order={3} mb="md" className={classes.sectionTitle}>
              Timeline
            </Title>
            <Stack gap="md">
              {complaint.timeline.map((item, index) => (
                <div key={index} className={classes.timelineItem}>
                  <div className={classes.timelineBullet}></div>
                  <div className={classes.timelineContent}>
                    <Text className={classes.timelineEvent}>{item.event}</Text>
                    <Text size="sm" c="dimmed" className={classes.timelineTimestamp}>
                      {item.timestamp}
                    </Text>
                  </div>
                </div>
              ))}
            </Stack>
          </Paper>
          <Paper className={classes.infoBox} p="lg" withBorder>
            <Title order={4} mb="sm" className={classes.infoLabel}>
              Priority
            </Title>
            <TextInput value={complaint.priority} readOnly className={classes.infoInput} />
          </Paper>

          <Paper className={classes.infoBox} p="lg" withBorder>
            <Title order={4} mb="sm" className={classes.infoLabel}>
              Category
            </Title>
            <TextInput value={complaint.category} readOnly className={classes.infoInput} />
          </Paper>

          <Paper className={classes.infoBox} p="lg" withBorder>
            <Title order={4} mb="sm" className={classes.infoLabel}>
              Status
            </Title>
            {isAgent ? (
              <Select
                data={[
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Resolved', label: 'Resolved' },
                  { value: 'Unresolved', label: 'Unresolved' },
                ]}
                value={status}
                onChange={setStatus}
                className={classes.statusSelect}
                styles={{
                  input: {
                    color: getStatusColor(status),
                    fontWeight: 500,
                  },
                }}
              />
            ) : (
              <TextInput
                value={complaint.status}
                readOnly
                className={classes.infoInput}
                style={{ color: getStatusColor(complaint.status) }}
              />
            )}
          </Paper>
        </div>
      </div>

      <RatingModal
        opened={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        loading={submitting}
      />
    </Container>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'In Progress':
      return '#F59E0B';
    case 'Resolved':
      return '#10B981';
    case 'Unresolved':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

