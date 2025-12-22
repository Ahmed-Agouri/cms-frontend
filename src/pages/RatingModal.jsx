import { useState } from 'react';
import { Modal, Title, Text, Textarea, Button, Group, Stack } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import classes from './RatingModal.module.css';

export function RatingModal({ opened, onClose, onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(rating, feedback);
      setRating(0);
      setFeedback('');
      setHoveredRating(0);
    } catch (error) {
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    setHoveredRating(0);
    onClose();
  };

  const displayRating = hoveredRating || rating;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Title order={2} className={classes.modalTitle}>
          Share your experience
        </Title>
      }
      size="md"
      centered
      className={classes.modal}
    >
      <Stack gap="lg">
        <div className={classes.starContainer}>
          <Group gap="xs" justify="center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={classes.starButton}
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={handleStarLeave}
                aria-label={`Rate ${value} star${value !== 1 ? 's' : ''}`}
                aria-pressed={rating >= value}
              >
                <IconStar
                  size={40}
                  className={classes.starIcon}
                  style={{
                    fill: displayRating >= value ? '#FBBF24' : 'none',
                    stroke: displayRating >= value ? '#FBBF24' : '#D1D5DB',
                    strokeWidth: displayRating >= value ? 0 : 2,
                  }}
                />
              </button>
            ))}
          </Group>
        </div>
        <Textarea
          placeholder="Value"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          minRows={4}
          className={classes.feedbackInput}
          aria-label="Feedback textarea"
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            color="dark"
            onClick={handleSubmit}
            loading={loading}
            disabled={rating === 0 || loading}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

