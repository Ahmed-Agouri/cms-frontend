import { useState, useEffect, useCallback } from 'react';
import { Container, Title, TextInput, Select, Group, Loader, Center, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { AppHeader } from '../components/AppHeader';
import { AuditLogsTable } from '../components/AuditLogsTable';
import { useAuth } from '../hooks/useAuth';
import classes from './AuditLogsPage.module.css';

const mockLogs = [
  {
    id: 1,
    timestamp: '2025-11-28T14:32:00Z',
    user: 'Tony Sopranos',
    role: 'Consumer',
    action: 'Created Complaint',
    details: 'Status changed from Assigned to In Progress',
  },
  {
    id: 2,
    timestamp: '2025-10-18T14:32:00Z',
    user: 'Chris Daniels',
    role: 'Consumer',
    action: 'Accepted Solution',
    details: '',
  },
  {
    id: 3,
    timestamp: '2025-09-01T13:32:00Z',
    user: 'Martin Tyler',
    role: 'Support Person',
    action: 'Updated Status',
    details: '',
  },
  {
    id: 4,
    timestamp: '2025-12-21T13:32:00Z',
    user: 'Jess Tyler',
    role: 'Support Person',
    action: 'Added Resolution Note',
    details: '',
  },
  {
    id: 5,
    timestamp: '2025-12-04T13:32:00Z',
    user: 'Olivia Jacks',
    role: 'Help Desk Agent',
    action: 'Assigned Complaint',
    details: '',
  },
  {
    id: 6,
    timestamp: '2025-12-14T13:32:00Z',
    user: 'Ahmed Tyler',
    role: 'Help Desk Agent',
    action: 'Assigned Complaint',
    details: '',
  },
];

async function fetchAuditLogs(page, search, dateFilter, roleFilter, userRole) {
  // Replace with actual API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockLogs];

      if (search) {
        filtered = filtered.filter(
          (log) =>
            log.user.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.details.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (roleFilter && userRole !== 'Consumer') {
        filtered = filtered.filter((log) => log.role === roleFilter);
      }

      if (dateFilter) {
        const now = new Date();
        const filterDate = new Date();
        switch (dateFilter) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            filtered = filtered.filter((log) => new Date(log.timestamp) >= filterDate);
            break;
        }
      }

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

export function AuditLogsPage() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [dateFilter, setDateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const isConsumer = user?.role === 'Consumer';
  const showUserColumn = !isConsumer;
  const showRoleColumn = !isConsumer;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAuditLogs(
        currentPage,
        debouncedSearch,
        dateFilter,
        roleFilter,
        user?.role
      );
      setLogs(response.data);
      setPagination(response.pagination);
    }
    catch (error) {

    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, dateFilter, roleFilter, user?.role]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateFilter, roleFilter]);

  const getPageTitle = () => {
    return isConsumer ? 'My Activity' : 'Audit logs';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <AppHeader userRole={user?.role || 'Consumer'} onLogout={handleLogout} />
      <Container size="xl" className={classes.container}>
        <Title order={1} className={classes.pageTitle}>
          {getPageTitle()}
        </Title>

        <div className={classes.controls}>
          <Group className={classes.searchGroup}>
            <TextInput
              placeholder="Search Logs"
              leftSection={<IconSearch size={18} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={classes.searchInput}
            />

            <Select
              placeholder="Date Filter ↓"
              data={[
                { value: '', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
              ]}
              value={dateFilter}
              onChange={setDateFilter}
              className={classes.filterSelect}
              clearable
            />

            {!isConsumer && (
              <Select
                placeholder="Role Filter ↓"
                data={[
                  { value: '', label: 'All Roles' },
                  { value: 'Consumer', label: 'Consumer' },
                  { value: 'Support Person', label: 'Support Person' },
                  { value: 'Help Desk Agent', label: 'Help Desk Agent' },
                  { value: 'Tenant Admin', label: 'Tenant Admin' },
                ]}
                value={roleFilter}
                onChange={setRoleFilter}
                className={classes.filterSelect}
                clearable
              />
            )}
          </Group>
        </div>

        {loading ? (
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        ) : logs.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed" size="lg">
              No logs found
            </Text>
          </Center>
        ) : (
          <AuditLogsTable
            logs={logs}
            loading={loading}
            pagination={pagination}
            showUserColumn={showUserColumn}
            showRoleColumn={showRoleColumn}
            onPageChange={setCurrentPage}
          />
        )}
      </Container>
    </>
  );
}

