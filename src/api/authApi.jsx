// src/api/authApi.ts
import httpClient from './httpClient';

export async function login(email, password) {
  const res = await httpClient.post('/api/authentication/login', {
    email,
    password,
  });

  return res.data;
}

export async function getMe() {
  const res = await httpClient.get('/api/authentication/me');
  return res.data;
}
