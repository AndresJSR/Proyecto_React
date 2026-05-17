import { lazy } from 'react';

const ListCarreras = lazy(() => import('../pages/careers/ListCarrers'));
const CreateCarrera = lazy(() => import('../pages/careers/CreateCareers'));
const ListSemestres = lazy(() => import('../pages/Semester/ListSemester'));
const CreateSemestre = lazy(() => import('../pages/Semester/CreateSemester'));
const ListAsignaturas = lazy(() => import('../pages/Subjects/ListSubject'));
const CreateAsignatura = lazy(() => import('../pages/Subjects/CreaterSubject'));
const ListGrupos = lazy(() => import('../pages/Group/ListGroup'));
const CreateGrupo = lazy(() => import('../pages/Group/CreateGroup'));
const ListMatriculas = lazy(() => import('../pages/enrollment/ListEnrollment'));
const CreateMatricula = lazy(() => import('../pages/enrollment/CreateEnrollment'));
const ListInscripciones = lazy(() => import('../pages/inscripciones/ListInscripciones'));
const CreateInscripcion = lazy(() => import('../pages/inscripciones/CreateInscripcion'));
const ListStudyPlans = lazy(() => import('../pages/StudyPlan/ListStudyPlan'));
const CreateStudyPlan = lazy(() => import('../pages/StudyPlan/CreateStudyPlan'));
const ListRegistrations = lazy(() => import('../pages/Registration/ListRegistration'));
const CreateRegistration = lazy(() => import('../pages/Registration/CreateRegistration'));

const academicRoutes = [
  {
    path: '/carreras/list',
    title: 'Carreras',
    component: ListCarreras,
  },
  {
    path: '/carreras/create',
    title: 'Crear Carrera',
    component: CreateCarrera,
  },
  {
    path: '/semestres/list',
    title: 'Semestres',
    component: ListSemestres,
  },
  {
    path: '/semestres/create',
    title: 'Crear Semestre',
    component: CreateSemestre,
  },
  {
    path: '/asignaturas/list',
    title: 'Asignaturas',
    component: ListAsignaturas,
  },
  {
    path: '/asignaturas/create',
    title: 'Crear Asignatura',
    component: CreateAsignatura,
  },
  {
    path: '/grupos/list',
    title: 'Grupos',
    component: ListGrupos,
  },
  {
    path: '/grupos/create',
    title: 'Crear Grupo',
    component: CreateGrupo,
  },
  {
    path: '/enrollments/list',
    title: 'Matrículas',
    component: ListMatriculas,
  },
  {
    path: '/enrollments/create',
    title: 'Crear Matrícula',
    component: CreateMatricula,
  },
  {
    path: '/inscripciones/list',
    title: 'Inscripciones',
    component: ListInscripciones,
  },
  {
    path: '/inscripciones/create',
    title: 'Crear Inscripción',
    component: CreateInscripcion,
  },
  {
    path: '/study-plans/list',
    title: 'Planes de Estudio',
    component: ListStudyPlans,
  },
  {
    path: '/study-plans/create',
    title: 'Crear Plan de Estudio',
    component: CreateStudyPlan,
  },
  {
    path: '/registrations/list',
    title: 'Registros',
    component: ListRegistrations,
  },
  {
    path: '/registrations/create',
    title: 'Crear Registro',
    component: CreateRegistration,
  },
];

export default academicRoutes;
