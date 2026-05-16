import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { userBusiness, UserTableRow } from '../../business/UserBusiness';
import GenericTable from '../../components/GenericTable';
import UserFilters from '../../components/users/UserFilters';
import UserTableActions from '../../components/users/UserTableActions';
import { UserSearchFilters, userService } from '../../services/userService';

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<UserTableRow[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const loadUsers = (users: any[]) => {
    const rows = userBusiness.mapUsersToTableRows(users);
    setData(rows);
  };

  const fetchData = async () => {
    const users = await userService.getUsers();
    loadUsers(users);
  };

  const handleSearch = async (filters: UserSearchFilters) => {
    const users = await userService.searchUsers(filters);
    loadUsers(users);
  };

  const handleClearFilters = async () => {
    await fetchData();
  };

  const handleAction = (action: string, item: UserTableRow) => {
    if (action === 'edit') {
      navigate(`/users/update/${item.id}`);
    }

    if (action === 'deactivate') {
      if (!item.is_active) {
        Swal.fire({
          title: 'Aviso',
          text: 'Este usuario ya se encuentra inactivo.',
          icon: 'info',
          timer: 3000,
        });
        return;
      }

      navigate(`/users/deactivate/${item.id}`);
    }

    if (action === 'view') {
      navigate(`/users/view/${item.id}`);
    }
  };

  const handleCreate = () => {
    navigate('/users/create');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Usuarios
          </h2>
          <p className="text-sm text-gray-500">
            Gestiona las cuentas de docentes y estudiantes del sistema.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
        >
          + Nuevo usuario
        </button>
      </div>

      <UserFilters onSearch={handleSearch} onClear={handleClearFilters} />

      <GenericTable<UserTableRow>
        data={data}
        columns={[
          { key: 'code', label: 'Código' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Rol' },
          { key: 'career', label: 'Carrera' },
          { key: 'status', label: 'Estado' },
          { key: 'created_at', label: 'Fecha de creación' },
        ]}
        renderActions={(item) => (
          <UserTableActions item={item} onAction={handleAction} />
        )}
      />
    </div>
  );
};

export default Users;
