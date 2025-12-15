import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Anchor,
  Stack,
  Image,
} from '@mantine/core';
import cmsLogo from '../assets/images/cms-logo.svg?url';
import classes from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // need to replace with actual authentication logic later from my auth service
    navigate('/dashboard');
  };

  const handleSignInTop = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    // need to replace with actual register flow later
    console.log('Register clicked');
  };

  return (
    <Box className={classes.page}>
      
      <header className={classes.header}>
        <Group gap="xs" className={classes.logoGroup}>
          <Image src={cmsLogo} alt="CMS Logo" height={32} width={32} />
          <Text className={classes.logoText}>CMS</Text>
        </Group>

        <Group gap="sm">
          <Button variant="outline" color="dark" onClick={handleSignInTop}>
            Sign in
          </Button>
          <Button color="dark" onClick={handleRegister}>
            Register
          </Button>
        </Group>
      </header>

      <Container size="xs" className={classes.centerContainer}>
        <Paper withBorder radius="md" p="xl" className={classes.card}>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div>
                <Text className={classes.formTitle}>Sign in to CMS</Text>
                <Text size="sm" c="dimmed">
                  Enter your email and password to access your complaints.
                </Text>
              </div>

              <TextInput
                label="Email"
                placeholder="JohnDoe@Gmail.com"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="********"
                required
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />

              <Button type="submit" fullWidth color="dark" size="md" className={classes.signInButton}>
                Sign In
              </Button>

              <Group justify="center" mt="xs">
                <Anchor component="button" type="button"  underline="always">
                  Forgot password?
                </Anchor>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
