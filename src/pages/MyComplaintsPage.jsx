import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  TextInput,
  Button,
  Table,
  Group,
  Text,
  Select,
  Loader,
  Center,
  Badge,
} from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { getMyComplaints } from '../api/complaintsApi';
import classes from './MyComplaintsPage.module.css';

function getStatusColor(status) {
  switch (status) {
    case 'Resolved':
      return 'green';
    case 'InProgress':
      return 'yellow';
    case 'Open':
      return 'red';
    default:
      return 'gray';
  }
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 60) return `${mins} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export function MyComplaintsPage() {
  const navigate = useNavigate();

  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getMyComplaints();
      setAllComplaints(data);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter((c) => {
      const matchesSearch =
        !debouncedSearch ||
        c.title.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        !statusFilter || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allComplaints, debouncedSearch, statusFilter]);

  const rows = filteredComplaints.map((c) => (
    <Table.Tr key={c.id}>
      <Table.Td>
        <Text fw={500}>{c.title}</Text>
      </Table.Td>

      <Table.Td>
        <Badge color={getStatusColor(c.status)}>
          {c.status}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="sm">
          {formatRelativeTime(c.updatedAt ?? c.createdAt)}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text
          className={classes.viewLink}
          onClick={() => navigate(`/complaints/${c.id}`)}
        >
          View
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" className={classes.container}>
      <div className={classes.header}>
        <Title order={1}>My Complaints</Title>
      </div>

      <div className={classes.controls}>
        <Group>
          <TextInput
            placeholder="Search complaint"
            leftSection={<IconSearch size={16} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <Select
            placeholder="Status"
            data={[
              { value: '', label: 'All' },
              { value: 'Open', label: 'Open' },
              { value: 'InProgress', label: 'In Progress' },
              { value: 'Resolved', label: 'Resolved' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
          />
        </Group>

        <Button
          leftSection={<IconPlus size={16} />}
          color="green"
          onClick={() => navigate('/complaints/create')}
        >
          New Complaint
        </Button>
      </div>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : error ? (
        <Center py="xl">
          <Text c="red">{error}</Text>
        </Center>
      ) : filteredComplaints.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">No complaints found</Text>
        </Center>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last Updated</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
