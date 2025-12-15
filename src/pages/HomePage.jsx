import { Container, Title, Text } from '@mantine/core';

export function HomePage() {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md">Welcome to CMS</Title>
      <Text size="lg" c="dimmed">
        This is the home page.
      </Text>
    </Container>
  );
}
