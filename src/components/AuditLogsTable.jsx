import { Table, Text, Group, Button } from '@mantine/core';
import classes from './AuditLogsTable.module.css';

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day} ${month} ${year},\n${time}`;
}

export function AuditLogsTable({
  logs,
  loading,
  pagination,
  showUserColumn = true,
  showRoleColumn = true,
  onPageChange,
}) {
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
    <>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <Table.Thead>
            <Table.Tr className={classes.tableHeader}>
              <Table.Th>Timestamp</Table.Th>
              {showUserColumn && <Table.Th>User</Table.Th>}
              {showRoleColumn && <Table.Th>Role</Table.Th>}
              <Table.Th>Action</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {logs.map((log) => (
              <Table.Tr key={log.id} className={classes.tableRow}>
                <Table.Td>
                  <Text className={classes.timestamp} style={{ whiteSpace: 'pre-line' }}>
                    {formatTimestamp(log.timestamp)}
                  </Text>
                </Table.Td>
                {showUserColumn && (
                  <Table.Td>
                    <Text className={classes.user}>{log.user}</Text>
                  </Table.Td>
                )}
                {showRoleColumn && (
                  <Table.Td>
                    <Text className={classes.role}>{log.role}</Text>
                  </Table.Td>
                )}
                <Table.Td>
                  <Text className={classes.action}>{log.action}</Text>
                </Table.Td>
                <Table.Td>
                  <Text className={classes.details}>{log.details || '-'}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className={classes.paginationWrapper}>
          <Group gap="xs">
            <Button
              variant="outline"
              onClick={() => onPageChange((p) => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
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
                  variant={item === pagination.page ? 'filled' : 'outline'}
                  onClick={() => onPageChange(item)}
                  size="sm"
                  className={item === pagination.page ? classes.activePage : ''}
                >
                  {item}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => onPageChange((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page === pagination.totalPages}
              size="sm"
            >
              Next
            </Button>
          </Group>
        </div>
      )}
    </>
  );
}

