import { useNavigate } from 'react-router-dom';
import { IconHome, IconPlus } from '@tabler/icons-react';
import {
  Group,
  Image,
  Button,
  Text,
  Container,
  Box,
} from '@mantine/core';
import cmsLogo from '../assets/images/cms-logo.svg?url';
import classes from './HeaderTabs.module.css';


export function HeaderTabs() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
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
              leftSection={<IconHome size={20} />}
              onClick={() => navigate('/dashboard')}
              size="md"
            >
              Dashboard
            </Button>

            <Button
              variant="subtle"
              leftSection={<IconPlus size={20} />}
              onClick={() => navigate('/complaints/create')}
              size="md"
            >
              Submit Complaint
            </Button>

            <Button
              variant="subtle"
              onClick={handleLogout}
              size="md"
            >
              Log out
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
