import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../images/logo/logo.svg';
import { useViewRole } from '../context/RoleContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { viewRole, toggleViewRole } = useViewRole();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const isTeacher = viewRole === 'TEACHER';

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {isTeacher ? <TeacherMenu pathname={pathname} /> : <StudentMenu pathname={pathname} />}
        </nav>
      </div>

      {/* ROLE SWITCHER TEMPORAL */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={toggleViewRole}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-strokedark bg-graydark px-4 py-2 text-sm font-medium text-bodydark1 duration-300 ease-in-out hover:bg-meta-4"
          title="Cambiar rol (temporal - solo para desarrollo)"
        >
          <svg className="fill-current" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z" fill="" />
            <path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" fill="" />
            <path d="M8 13C5.23858 13 3 15.2386 3 18V19H13V18C13 15.2386 10.7614 13 8 13Z" fill="" />
            <path d="M16 13C15.3065 13 14.6462 13.1416 14.0466 13.3973C15.2596 14.4846 16 16.0625 16 18V19H21V18C21 15.2386 18.7614 13 16 13Z" fill="" />
          </svg>
          {isTeacher ? '👩‍🎓 Ver como Estudiante' : '👨‍🏫 Ver como Docente'}
        </button>
        <p className="mt-1 text-center text-xs text-bodydark2 opacity-60">⚠️ Botón temporal de desarrollo</p>
      </div>
    </aside>
  );
};

/* ───────────────────────────── MENÚ DOCENTE ───────────────────────────── */
const TeacherMenu = ({
  pathname,
}: {
  pathname: string;
}) => (
  <>
    {/* INICIO */}
    <div>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname === '/' && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 6.75L9 1.5L2.25 6.75V15.75H6.75V11.25H11.25V15.75H15.75V6.75Z" fill="" />
            </svg>
            Inicio
          </NavLink>
        </li>
      </ul>
    </div>

    {/* MI CLASE */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MI CLASE</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/grupos"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('grupos') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            Grupos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users/list"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Estudiantes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/evaluaciones"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('evaluaciones') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.25 2.75H14.75C15.4404 2.75 16 3.30964 16 4V14C16 14.6904 15.4404 15.25 14.75 15.25H3.25C2.55964 15.25 2 14.6904 2 14V4C2 3.30964 2.55964 2.75 3.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 9H9.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Evaluaciones
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calificaciones"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('calificaciones') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Calificaciones
          </NavLink>
        </li>
      </ul>
    </div>

    {/* RUBRICAS */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RUBRICAS</h3>
      <ul className="mb-6 flex flex-col gap-1.5">

        {/* HU-08 / HU-09: Crear rúbrica con criterios y escalas */}
        <li>
          <NavLink
            to="/rubricas/create"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname === '/rubricas/create' && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nueva rúbrica
          </NavLink>
        </li>

        {/* HU-08 CA6 / HU-10: Ver, archivar, eliminar y asociar rúbricas */}
        <li>
          <NavLink
            to="/rubricas/mis-rubricas"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('mis-rubricas') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Mis rúbricas
          </NavLink>
        </li>

        {/* HU-10: Asociar rúbrica a evaluación */}
        <li>
          <NavLink
            to="/evaluaciones/asociar-rubrica"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('asociar-rubrica') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Asociar a evaluación
          </NavLink>
        </li>

      </ul>
    </div>

    {/* MI CLASE — Calificar (HU-11 / HU-12) */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">EVALUACIONES</h3>
      <ul className="mb-6 flex flex-col gap-1.5">

        {/* HU-11: Calificar estudiante con rúbrica */}
        <li>
          <NavLink
            to="/evaluaciones"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname === '/evaluaciones' && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.25 2.75H14.75C15.4404 2.75 16 3.30964 16 4V14C16 14.6904 15.4404 15.25 14.75 15.25H3.25C2.55964 15.25 2 14.6904 2 14V4C2 3.30964 2.55964 2.75 3.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 9H9.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Calificar
          </NavLink>
        </li>

      </ul>
    </div>

    {/* RECURSOS */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RECURSOS</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/escalas"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('escalas') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Escalas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/biblioteca"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('biblioteca') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Biblioteca
          </NavLink>
        </li>
      </ul>
    </div>

    {/* CONFIGURACIÓN */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">CONFIGURACIÓN</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/profile"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065Z" fill=""/>
              <path d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z" fill=""/>
            </svg>
            Perfil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('settings') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Preferencias
          </NavLink>
        </li>
      </ul>
    </div>
  </>
);

/* ───────────────────────────── MENÚ ESTUDIANTE ───────────────────────────── */
const StudentMenu = ({ pathname }: { pathname: string }) => (
  <>
    {/* INICIO */}
    <div>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname === '/' && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 6.75L9 1.5L2.25 6.75V15.75H6.75V11.25H11.25V15.75H15.75V6.75Z" fill="" />
            </svg>
            Inicio
          </NavLink>
        </li>
      </ul>
    </div>

    {/* MI ESPACIO */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MI ESPACIO</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/mis-asignaturas"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('mis-asignaturas') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Mis asignaturas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mis-evaluaciones"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('mis-evaluaciones') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.25 2.75H14.75C15.4404 2.75 16 3.30964 16 4V14C16 14.6904 15.4404 15.25 14.75 15.25H3.25C2.55964 15.25 2 14.6904 2 14V4C2 3.30964 2.55964 2.75 3.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 9H9.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Mis evaluaciones
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mis-notas"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('mis-notas') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Mis notas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('calendar') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812Z" fill=""/>
            </svg>
            Calendario
          </NavLink>
        </li>
      </ul>
    </div>

    {/* RECURSOS */}
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RECURSOS</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink
            to="/rubricas/create"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('rubricas') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.25 2.75H14.75C15.4404 2.75 16 3.30964 16 4V14C16 14.6904 15.4404 15.25 14.75 15.25H3.25C2.55964 15.25 2 14.6904 2 14V4C2 3.30964 2.55964 2.75 3.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 9H9.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Rubricas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/material-apoyo"
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes('material-apoyo') && 'bg-graydark dark:bg-meta-4'
            }`}
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Material de apoyo
          </NavLink>
        </li>
      </ul>
    </div>
  </>
);

export default Sidebar;