import { lazy } from 'react';
import { UserRole } from '../models/UserRole';
import DeactivateUser from '../pages/Users/DeactivateUser';
import ViewUserPage from '../pages/Users/ViewUser';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo = lazy(() => import('../pages/Demo'));
const ImageEditor = lazy(() => import('../pages/ImageEditor'));
const RubricaCreate = lazy(() => import('../pages/Rubricas/Create'));
const MisRubricas = lazy(() => import('../pages/Rubricas/MisRubricas'));
const Evaluaciones = lazy(() => import('../pages/Evaluaciones/Index'));
const AsociarRubrica = lazy(() => import('../pages/Evaluaciones/AsociarRubrica'));
const CalificarEstudiante = lazy(() => import('../pages/Evaluaciones/CalificarEstudiante'));
const UserList = lazy(() => import('../pages/Users/ListUsers'));
const UserCreate = lazy(() => import('../pages/Users/Create'));
const UserUpdate = lazy(() => import('../pages/Users/Update'));
const RoleList = lazy(() => import('../pages/Roles/List'));
const Posts = lazy(() => import('../pages/Posts/List'));

const coreRoutes = [
  {
    path: '/users/list',
    title: 'Users',
    component: UserList,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    path: '/users/create',
    title: 'Create User',
    component: UserCreate,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    path: '/users/update/:id',
    title: 'Edit User',
    component: UserUpdate,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    path: '/users/deactivate/:id',
    title: 'Deactivate User',
    component: DeactivateUser,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    path: '/users/view/:id',
    title: 'View User',
    component: ViewUserPage,
    allowedRoles: [UserRole.ADMIN],
  },

  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },

  {
    path: '/posts/list',
    title: 'Posts',
    component: Posts,
  },
  {
    path: '/roles-list',
    title: 'Roles',
    component: RoleList,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    path: '/demo',
    title: 'Demo',
    component: Demo,
  },
  {
    path: '/calendar',
    title: 'Calendar',
    component: Calendar,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/rubricas/create',
    title: 'Crear Rúbrica',
    component: RubricaCreate,
  },
  {
    path: '/evaluaciones',
    title: 'Evaluaciones',
    component: Evaluaciones,
  },
  {
    path: '/evaluaciones/asociar-rubrica',
    title: 'Asociar Rúbrica',
    component: AsociarRubrica,
  },
  {
    path: '/evaluaciones/:evaluationId/:groupId/calificar',
    title: 'Calificar Estudiante',
    component: CalificarEstudiante,
  },
  {
    path: '/image-editor',
    title: 'Image Editor',
    component: ImageEditor,
  },
  {
    path: '/rubricas/mis-rubricas',
    title: 'Mis Rúbricas',
    component: MisRubricas,
  },
];

const routes = [...coreRoutes];

export default routes;
