import { lazy } from 'react';
import { UserRole } from '../models/UserRole';
import DeactivateUser from '../pages/Users/DeactivateUser';
import ViewUserPage from '../pages/Users/ViewUser';
import academicRoutes from './academicRoutes';

// ── Páginas compartidas ───────────────────────────────────────────────────────
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Calendar = lazy(() => import('../pages/Calendar'));

// ── Admin ─────────────────────────────────────────────────────────────────────
const UserList = lazy(() => import('../pages/Users/ListUsers'));
const UserCreate = lazy(() => import('../pages/Users/Create'));
const UserUpdate = lazy(() => import('../pages/Users/Update'));
const RoleList = lazy(() => import('../pages/Roles/List'));

// ── Profesor ──────────────────────────────────────────────────────────────────
const RubricaCreate = lazy(() => import('../pages/Rubricas/Create'));
const MisRubricas = lazy(() => import('../pages/Rubricas/MisRubricas'));
const Evaluaciones = lazy(() => import('../pages/Evaluaciones/Index'));
const CrearEvaluacion = lazy(() => import('../pages/Evaluaciones/CrearEvaluacion'));
const AsociarRubrica = lazy(() => import('../pages/Evaluaciones/AsociarRubrica'));
const CalificarEstudiante = lazy(() => import('../pages/Evaluaciones/CalificarEstudiante'));

const ADMIN = [UserRole.ADMIN];
const TEACHER = [UserRole.TEACHER];
const STUDENT = [UserRole.STUDENT];
const ALL_ROLES = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT];

const coreRoutes = [
  {
    path: '/profile',
    title: 'Perfil',
    component: Profile,
    allowedRoles: ALL_ROLES,
  },
  {
    path: '/settings',
    title: 'Configuración',
    component: Settings,
    allowedRoles: ALL_ROLES,
  },
  {
    path: '/users/list',
    title: 'Usuarios',
    component: UserList,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/create',
    title: 'Crear usuario',
    component: UserCreate,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/update/:id',
    title: 'Editar usuario',
    component: UserUpdate,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/deactivate/:id',
    title: 'Desactivar usuario',
    component: DeactivateUser,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/view/:id',
    title: 'Ver usuario',
    component: ViewUserPage,
    allowedRoles: ADMIN,
  },
  {
    path: '/roles-list',
    title: 'Roles',
    component: RoleList,
    allowedRoles: ADMIN,
  },
  {
    path: '/rubricas/create',
    title: 'Crear Rúbrica',
    component: RubricaCreate,
    allowedRoles: TEACHER,
  },
  {
    path: '/rubricas/mis-rubricas',
    title: 'Mis Rúbricas',
    component: MisRubricas,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones',
    title: 'Evaluaciones',
    component: Evaluaciones,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/crear',
    title: 'Crear Evaluación',
    component: CrearEvaluacion,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/asociar-rubrica',
    title: 'Asociar Rúbrica',
    component: AsociarRubrica,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/:evaluationId/:groupId/calificar',
    title: 'Calificar Estudiante',
    component: CalificarEstudiante,
    allowedRoles: TEACHER,
  },
  {
    path: '/calendar',
    title: 'Calendario',
    component: Calendar,
    allowedRoles: STUDENT,
  },
];

const routes = [...coreRoutes, ...academicRoutes];

export default routes;
