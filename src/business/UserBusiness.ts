import { User } from '../models/User';
import { UserRole } from '../models/UserRole';

export interface UserTableRow {
  id?: string;
  code?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  created_at?: string;
  //career?:string;
}

class UserBusiness {
  getUserFullName(user: User): string {
    if (user.profile) {
      const firstName = user.profile.first_name ?? '';
      const lastName = user.profile.last_name ?? '';

      return `${firstName} ${lastName}`.trim();
    }

    if (user.role === UserRole.ADMIN) {
      return 'Administrador';
    }

    return 'Sin perfil';
  }

  getUserRoleLabel(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';

      case UserRole.TEACHER:
        return 'Docente';

      case UserRole.STUDENT:
        return 'Estudiante';

      default:
        return 'Desconocido';
    }
  }

  getUserStatusLabel(user: User): string {
    return user.is_active ? 'Activo' : 'Inactivo';
  }

  formatUserCreatedAt(date?: string): string {
    if (!date) return '';

    return new Date(date).toLocaleDateString();
  }

  mapUserToTableRow(user: User): UserTableRow {
    return {
      id: user.id,
      code: user.code,
      name: this.getUserFullName(user),
      email: user.email,
      //career: 
      role: this.getUserRoleLabel(user.role),
      status: this.getUserStatusLabel(user),
      created_at: this.formatUserCreatedAt(user.created_at),
    };
  }

  mapUsersToTableRows(users: User[]): UserTableRow[] {
    return users.map((user) => this.mapUserToTableRow(user));
  }
}

export const userBusiness = new UserBusiness();
