import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { User } from '../../models/User';
import { userService } from '../../services/userService';
import { userBusiness } from '../../business/UserBusiness';
import { UserFormValues } from '../../components/users/UserFormValidator';

import Breadcrumb from '../../components/Breadcrumb';
import UserFormValidator from '../../components/users/UserFormValidator';

const UpdateUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const userData = await userService.getUserById(id);
      setUser(userData);
    };

    fetchUser();
  }, [id]);

  const handleUpdateUser = async (values: UserFormValues) => {
    if (!user?.id) return;

    try {
      const payload = userBusiness.buildUpdateUserPayload(values);

      console.log('Payload update:', payload);
      const updatedUser = await userService.updateUser(user.id, payload);
      if (updatedUser) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente el registro',
          icon: 'success',
          timer: 3000,
        });

        navigate('/users/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar el registro',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar el registro',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Actualizar Usuario" />

      <UserFormValidator handleAction={handleUpdateUser} mode={2} user={user} />
    </>
  );
};

export default UpdateUserPage;
