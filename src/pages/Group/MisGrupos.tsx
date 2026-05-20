import { useNavigate } from 'react-router-dom'
import useGruposDocente from '../../hooks/useGruposDocente'
import GroupCard from '../../components/Group/GroupCard'

const MisGrupos = () => {
  const navigate = useNavigate()
  const { groupCards, isLoading, error } = useGruposDocente()

  const handleVerDetalle = (groupId: string) => {
    navigate(`/teacher/grupos/detalle?groupId=${groupId}`)
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Mis grupos
        </h2>
        <p className="text-sm text-bodydark2 mt-1">
          {isLoading
            ? 'Cargando grupos...'
            : `${groupCards.length} grupo${groupCards.length !== 1 ? 's' : ''} asignado${groupCards.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Estado: cargando */}
      {isLoading && (
        <p className="text-sm text-bodydark2">Cargando grupos...</p>
      )}

      {/* Estado: error */}
      {!isLoading && error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {/* Estado: sin grupos */}
      {!isLoading && !error && groupCards.length === 0 && (
        <p className="text-sm text-bodydark2">
          No tienes grupos asignados en el semestre activo.
        </p>
      )}

      {/* Grid de tarjetas */}
      {!isLoading && !error && groupCards.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groupCards.map((card) => (
            <GroupCard
              key={card.id}
              card={card}
              onVerDetalle={handleVerDetalle}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default MisGrupos