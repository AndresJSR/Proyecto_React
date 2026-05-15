import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { userService } from '../../services/UserService2';
import { userBusiness, UserTableRow } from '../../business/UserBusiness';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<UserTableRow[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const users = await userService.getUsers();
    const rows = userBusiness.mapUsersToTableRows(users);

    setData(rows);
  };

  const handleAction = (action: string, item: UserTableRow) => {
    if (action === 'edit') {
      navigate(`/users/update/${item.id}`);
    }

    if (action === 'delete') {
      console.log('Delete user:', item);
    }
  };

  const handleCreate = () => {
    navigate('/users/create');
  };

  return (
    <div>
      <h2>User List</h2>

      <button
        onClick={handleCreate}
        className="inline-flex items-center justify-center bg-primary py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-opacity-90 transition"
      >
        Crear
      </button>

      <GenericTable<UserTableRow>
        data={data}
        columns={[
          { key: 'code', label: 'Código' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Rol' },
          { key: 'status', label: 'Estado' },
          { key: 'created_at', label: 'Fecha de creación' },
        ]}
        actions={[
          { name: 'edit', label: 'Editar' },
          { name: 'delete', label: 'Desactivar' },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default Users;
