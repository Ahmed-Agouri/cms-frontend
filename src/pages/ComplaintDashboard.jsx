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
} from '@mantine/core';
import { IconSearch, IconCheck } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import classes from './ComplaintDashboard.module.css';
import { getComplaintsForAgent } from '../api/complaintsApi';
import { confirmResolution } from '../api/complaintsApi';


const PAGE_SIZE = 10;

export function ComplaintDashboard() {
  const navigate = useNavigate();
  

  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getComplaintsForAgent();
        setAllComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        setAllComplaints([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter((c) => {
      const matchesSearch =
        !debouncedSearch ||
        c.title.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesCategory = !categoryFilter || c.category === categoryFilter;
      const matchesPriority = !priorityFilter || c.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [
    allComplaints,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    priorityFilter,
  ]);

  const totalPages = Math.ceil(filteredComplaints.length / PAGE_SIZE);
  const pagedComplaints = filteredComplaints.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const handleViewComplaint = (id) => {
    navigate(`/complaints/${id}?agent=true`);
  };

  return (
    <Container size="xl" className={classes.container}>
      <Title order={1}>Complaint Dashboard</Title>

      <TextInput
        placeholder="Search complaints"
        leftSection={<IconSearch size={18} />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        mb="md"
      />

      <Group mb="md">
        <Select
          placeholder="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          data={[
            { value: 'Open', label: 'Open' },
            { value: 'InProgress', label: 'In Progress' },
            { value: 'Resolved', label: 'Resolved' },
          ]}
        />

        <Select
          placeholder="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          clearable
          data={[
            { value: 'BillingOrPayments', label: 'Billing / Payments' },
            { value: 'ServiceQuality', label: 'Service Quality' },
            { value: 'TechnicalIssue', label: 'Technical Issue' },
          ]}
        />

        <Select
          placeholder="Priority"
          value={priorityFilter}
          onChange={setPriorityFilter}
          clearable
          data={[
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
        />
      </Group>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : pagedComplaints.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed">No complaints found</Text>
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {pagedComplaints.map((c) => (
                <Table.Tr key={c.id}>
                  <Table.Td>{c.title}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {c.status === 'Resolved' && <IconCheck size={14} />}
                      <Text>{c.status}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{c.category}</Table.Td>
                  <Table.Td>{c.priority}</Table.Td>
                  <Table.Td>
                    <Button
                      variant="subtle"
                      onClick={() => handleViewComplaint(c.id)}
                    >
                      View
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="center" mt="md">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
}
