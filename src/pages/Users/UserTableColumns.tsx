import type { TableColumn } from '../../components/GenericTable';
import type { User } from '../../models/User';

export const userTableColumns: TableColumn<User>[] = [
  {
    key: 'code',
    header: 'Código',
    accessor: 'code',
  },
  {
    key: 'name',
    header: 'Nombre',
    render: (user) => user.teacher?.name ?? user.student?.name ?? '—',
  },
  {
    key: 'email',
    header: 'Email',
    accessor: 'email',
  },
  {
    key: 'role',
    header: 'Rol',
    render: (user) => user.role ?? '—',
  },
  {
    key: 'career',
    header: 'Carrera',
    render: (user) =>
      user.teacher?.career?.name ?? user.student?.career?.name ?? '—',
  },
  {
    key: 'is_active',
    header: 'Estado',
    render: (user) => (user.is_active ? 'Activo' : 'Inactivo'),
  },
  {
    key: 'created_at',
    header: 'Fecha de creación',
    render: (user) =>
      user.created_at ? new Date(user.created_at).toLocaleDateString() : '—',
  },
];
