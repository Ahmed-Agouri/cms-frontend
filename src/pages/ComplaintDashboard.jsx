import { useState, useEffect, useCallback } from 'react';
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
import { IconSearch, IconPlus, IconCheck } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import classes from './ComplaintDashboard.module.css';


async function fetchComplaints(page = 1, search = '', status = '', category = '', priority = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockData.filter((complaint) => {
        const matchesSearch =
          !search ||
          complaint.reference.toLowerCase().includes(search.toLowerCase()) ||
          complaint.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !status || complaint.status === status;
        const matchesCategory = !category || complaint.category === category;
        const matchesPriority = !priority || complaint.priority === priority;
        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      });

      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginated = filtered.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filtered.length / pageSize);

      resolve({
        data: paginated,
        pagination: {
          page,
          pageSize,
          total: filtered.length,
          totalPages,
        },
      });
    }, 500);
  });
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays === 1) {
    return '1 Day ago';
  } else {
    return `${diffDays} Days ago`;
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'In Progress':
      return '#F59E0B';
    case 'Resolved':
      return '#10B981';
    case 'Unresolved':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

export function ComplaintDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchComplaints(
        currentPage,
        debouncedSearch,
        statusFilter,
        categoryFilter,
        priorityFilter
      );
      setComplaints(response.data);
      setPagination(response.pagination);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const handleViewComplaint = (complaintId) => {
    navigate(`/complaints/${complaintId}?agent=true`);
  };

  const handleResolveComplaint = () => {
    navigate('/complaints/resolve');
  };

  const rows = complaints.map((complaint) => (
    <Table.Tr key={complaint.id} className={classes.tableRow}>
      <Table.Td>
        <Text fw={700} className={classes.reference}>
          {complaint.reference}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text className={classes.title}>{complaint.title}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          {complaint.status === 'Resolved' && (
            <IconCheck size={16} style={{ color: getStatusColor(complaint.status) }} />
          )}
          <Text
            style={{ color: getStatusColor(complaint.status) }}
            className={classes.status}
          >
            {complaint.status}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text className={classes.category}>{complaint.category}</Text>
      </Table.Td>
      <Table.Td>
        <Text className={classes.priority}>{complaint.priority}</Text>
      </Table.Td>
      <Table.Td>
        <Text className={classes.lastUpdated}>
          {formatRelativeTime(complaint.updatedAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          className={classes.viewLink}
          onClick={() => handleViewComplaint(complaint.id)}
        >
          View Complaint
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  const getPaginationItems = () => {
    const items = [];
    const totalPages = pagination.totalPages;
    const current = pagination.page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (current > 3) {
        items.push('ellipsis-start');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (current < totalPages - 2) {
        items.push('ellipsis-end');
      }
      items.push(totalPages);
    }

    return items;
  };

  return (
    <Container size="xl" className={classes.container}>
      <div className={classes.header}>
        <Title order={1} className={classes.pageTitle}>
          Complaint Dashboard
        </Title>
      </div>

      <div className={classes.controls}>
        <Group className={classes.searchGroup}>
          <TextInput
            placeholder="Search Complaint"
            leftSection={<IconSearch size={18} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={classes.searchInput}
          />
        </Group>
        <Button
          leftSection={<IconPlus size={18} />}
          color="green"
          onClick={handleResolveComplaint}
          className={classes.resolveButton}
        >
          Resolve Complaint
        </Button>
      </div>

      <div className={classes.filtersRow}>
        <Select
          placeholder="Category ↓"
          data={[
            { value: 'BillingOrPayments', label: 'Billing / Payments' },
            { value: 'ServiceQuality', label: 'Service Quality' },
            { value: 'TechnicalIssue', label: 'Technical Issue' },
            { value: 'AccountOrAccess', label: 'Account / Access' },
            { value: 'ProductOrService', label: 'Product / Service' },
            { value: 'EmployeeConduct', label: 'Employee Conduct' },
            { value: 'DataPrivacyOrSecurity', label: 'Data Privacy / Security' },
            { value: 'Other', label: 'Other' },
          ]}
          value={categoryFilter}
          onChange={setCategoryFilter}
          className={classes.filterSelect}
          clearable
        />
        <Select
          placeholder="Priority ↓"
          data={[
            { value: '', label: 'All' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
          value={priorityFilter}
          onChange={setPriorityFilter}
          className={classes.filterSelect}
          clearable
        />
        <Select
          placeholder="Status ↓"
          data={[
            { value: '', label: 'All' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Resolved', label: 'Resolved' },
            { value: 'Unresolved', label: 'Unresolved' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className={classes.filterSelect}
          clearable
        />
      </div>

      {loading ? (
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      ) : complaints.length === 0 ? (
        <Center py="xl">
          <Text c="dimmed" size="lg">
            No complaints found
          </Text>
        </Center>
      ) : (
        <>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <Table.Thead>
                <Table.Tr className={classes.tableHeader}>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div className={classes.paginationWrapper}>
              <Group gap="xs">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                >
                  Previous
                </Button>

                {getPaginationItems().map((item, index) => {
                  if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                    return (
                      <Text key={`ellipsis-${index}`} className={classes.ellipsis}>
                        ...
                      </Text>
                    );
                  }
                  return (
                    <Button
                      key={item}
                      variant={item === currentPage ? 'filled' : 'outline'}
                      onClick={() => setCurrentPage(item)}
                      size="sm"
                      className={
                        item === currentPage ? classes.activePage : ''
                      }
                    >
                      {item}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={currentPage === pagination.totalPages}
                  size="sm"
                >
                  Next
                </Button>
              </Group>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
