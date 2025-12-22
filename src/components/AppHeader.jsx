import { Group, Button, Text, Image, Container, Box } from '@mantine/core';
import { IconHome, IconPlus } from '@tabler/icons-react';
import cmsLogo from '../assets/images/cms-logo.svg?url';
import classes from './AppHeader.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AppHeader() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'Consumer':
        return [
          { label: 'Dashboard', icon: IconHome, path: '/complaints/my' },
          { label: 'Submit Complaint', icon: IconPlus, path: '/complaints/create' },
        ];

      case 'SupportPerson':
        return [
          { label: 'Dashboard', icon: IconHome, path: '/dashboard' },
          { label: 'Resolve Complaint', icon: IconPlus, path: '/complaints/resolve' },
        ];

      case 'Admin':
        return [
          { label: 'Dashboard', icon: IconHome, path: '/admin/dashboard' },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
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
            onClick={() => navigate(navItems[0]?.path || '/dashboard')}
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
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="subtle"
                leftSection={<item.icon size={20} />}
                onClick={() => navigate(item.path)}
                size="md"
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="subtle"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Log out
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}