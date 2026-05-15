import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { userBusiness, UserTableRow } from '../../business/UserBusiness';
import GenericTable from '../../components/GenericTable';
import { userService } from '../../services/userService';

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
    if (action === 'deactivate') {
      if (!item.status) {
        Swal.fire({
          title: 'Aviso',
          text: 'Este usuario ya se encuentra inactivo.',
          icon: 'info',
          timer: 3000,
        });
        return;
      } else {
        navigate(`/users/deactivate/${item.id}`);
      }
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
          { key: 'career', label: 'Carrera' },
          { key: 'status', label: 'Estado' },
          { key: 'created_at', label: 'Fecha de creación' },
        ]}
        actions={[
          { name: 'edit', label: 'Editar' },
          { name: 'deactivate', label: 'Desactivar' },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default Users;
