import httpClient from './httpClient';

export async function createComplaint(payload) {
  const res = await httpClient.post('/api/complaints/', payload);
  return res.data.data;
}

export async function getMyComplaints() {
  const res = await httpClient.get('/api/complaints/my');
  return res.data.data;
}

export async function getComplaintById(id) {
  const res = await httpClient.get(`/api/complaints/${id}`);
  return res.data.data;
}

export async function updateComplaint(id, payload) {
  const res = await httpClient.put(`/api/complaints/${id}`, payload);
  return res.data.data;
}
