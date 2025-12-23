import httpClient from './httpClient';

export async function getAuditLogsForTenant() {
  const res = await httpClient.get('/api/audit/tenant');
  return res.data;
}
