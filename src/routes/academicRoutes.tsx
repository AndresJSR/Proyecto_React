import { lazy } from 'react';

const ListCarreras = lazy(() => import('../pages/careers/ListCarrers'));
const CreateCarrera = lazy(() => import('../pages/careers/CreateCareers'));
const ListSemestres = lazy(() => import('../pages/Semester/ListSemester'));
const CreateSemestre = lazy(() => import('../pages/Semester/CreateSemester'));
const ListAsignaturas = lazy(() => import('../pages/asignaturas/ListAsignaturas'));
const CreateAsignatura = lazy(() => import('../pages/asignaturas/CreateAsignatura'));
const ListGrupos = lazy(() => import('../pages/grupos/ListGrupos'));
const CreateGrupo = lazy(() => import('../pages/grupos/CreateGrupo'));
const ListMatriculas = lazy(() => import('../pages/matriculas/ListMatriculas'));
const CreateMatricula = lazy(() => import('../pages/matriculas/CreateMatricula'));
const ListInscripciones = lazy(() => import('../pages/inscripciones/ListInscripciones'));
const CreateInscripcion = lazy(() => import('../pages/inscripciones/CreateInscripcion'));

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
    path: '/matriculas/list',
    title: 'Matrículas',
    component: ListMatriculas,
  },
  {
    path: '/matriculas/create',
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
];

export default academicRoutes;
