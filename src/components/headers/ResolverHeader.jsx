import { Group, Button, Text, Image, Container, Box, Stack } from '@mantine/core';
import { IconHome, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import cmsLogo from '../../assets/images/cms-logo.svg?url';
import classes from './Header.module.css';


export function ResolverHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
  };

  return (
    <Box
      component="header"
      className={classes.header}
      style={{
        height: '70px',
        padding: '0 var(--mantine-spacing-md)',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 200,
      }}
    >
      <Container size="xl" style={{ height: '100%', width: '100%' }}>
        <Group justify="space-between" style={{ width: '100%', height: '100%' }}>
          <Group
            gap="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Image
              src={cmsLogo}
              alt="CMS Logo"
              height={45}
              width={45}
              style={{ display: 'block' }}
            />
            <Text size="xl" fw={700} c="blue">
              CMS
            </Text>
          </Group>

          <Group gap="lg">
            <Button
              variant="subtle"
              onClick={() => navigate('/dashboard')}
              size="md"
              style={{ padding: '0.5rem 1rem' }}
            >
              <Stack gap={2} align="center">
                <IconHome size={20} />
                <Text size="sm">Dashboard</Text>
              </Stack>
            </Button>

            <Button
              variant="subtle"
              onClick={() => navigate('/complaints/resolve')}
              size="md"
              style={{ padding: '0.5rem 1rem' }}
            >
              <Stack gap={2} align="center">
                <IconPlus size={20} />
                <Text size="sm">Resolve Complaint</Text>
              </Stack>
            </Button>

            <Button variant="subtle" onClick={handleLogout} size="md">
              Log out
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

