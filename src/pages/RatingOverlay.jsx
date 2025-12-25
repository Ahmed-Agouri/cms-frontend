// src/pages/RatingOverlay.jsx
import { useState } from 'react';
import { Textarea, Button, Group, Stack, Text } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

export function RatingOverlay({ onClose, onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const displayRating = hoveredRating || rating;


  const handleSubmit = () => {
    onSubmit(rating, feedback);
  };

  const handleCancel = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedback('');
    onClose();
  };

  return (
    <>
      {/* dark backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 1999,
        }}
        onClick={handleCancel}
      />

      {/* panel */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          width: '90%',
          maxWidth: '480px',
        }}
      >
        <Text fw={700} fz="lg" ta="center" mb="md">
          Share your experience
        </Text>

        <Stack gap="md">
          <Group justify="center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 4,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setRating(value);
                }}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <IconStar
                  size={36}
                  style={{
                    fill: displayRating >= value ? '#FBBF24' : 'none',
                    stroke: displayRating >= value ? '#FBBF24' : '#D1D5DB',
                  }}
                />
              </button>
            ))}
          </Group>

          <Textarea
            placeholder="Tell us more…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            minRows={3}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              color="green"
              onClick={handleSubmit}
              loading={loading}
              disabled={rating === 0 || loading}
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </div>
    </>
  );
}
