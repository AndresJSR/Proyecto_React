import useGruposDocente from '../../hooks/useGruposDocente'

const MisGrupos = () => {
  const { groups, isLoading, error } = useGruposDocente()

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Mis grupos
        </h2>
        <p className="text-sm text-bodydark2 mt-1">
          Grupos asignados en el semestre activo.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-bodydark2">Cargando grupos...</p>
      )}

      {!isLoading && error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {!isLoading && !error && groups.length === 0 && (
        <p className="text-sm text-bodydark2">
          No tienes grupos asignados en el semestre activo.
        </p>
      )}

      {!isLoading && !error && groups.length > 0 && (
        // TODO Tarea 5: reemplazar console.log por tabla/cards de grupos
        <>{console.log('grupos del docente:', groups)}</>
      )}
    </div>
  )
}

export default MisGrupos