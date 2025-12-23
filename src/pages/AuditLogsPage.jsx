import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  TextInput,
  Select,
  Group,
  Loader,
  Center,
  Text,
  Table,
  Button,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { getAuditLogsForTenant } from '../api/auditApi';
import { useAuth } from '../hooks/useAuth';

export function AuditLogsPage() {
  const { user } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAuditLogsForTenant();
        setLogs(Array.isArray(data) ? data : []);
      } catch (e) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !debouncedSearch ||
        log.actionType?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.description?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesAction =
        !actionFilter || log.actionType === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, debouncedSearch, actionFilter]);

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl">
      <Title order={1} mb="md">
        Audit Logs
      </Title>

      <Group mb="md">
        <TextInput
          placeholder="Search audit logs"
          leftSection={<IconSearch size={18} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <Select
          placeholder="Action Type"
          clearable
          value={actionFilter}
          onChange={setActionFilter}
          data={[
            { value: 'ComplaintCreated', label: 'Complaint Created' },
            { value: 'StatusUpdated', label: 'Status Updated' },
            { value: 'ResolutionAdded', label: 'Resolution Added' },
            { value: 'ComplaintClosed', label: 'Complaint Closed' },
          ]}
        />
      </Group>

      {filteredLogs.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">No audit logs found</Text>
        </Center>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Complaint</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredLogs.map((log) => (
              <Table.Tr key={log.auditId}>
                <Table.Td>
                  {new Date(log.timestamp).toLocaleString('en-GB')}
                </Table.Td>
                <Table.Td>{log.actionType}</Table.Td>
                <Table.Td>{log.description}</Table.Td>
                <Table.Td>
                  {log.complaintId ? log.complaintId.slice(0, 8) : '—'}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
