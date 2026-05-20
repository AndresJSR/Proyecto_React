import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { groupBusiness } from '../../business/GroupBusiness'
import { useDetalleGrupo } from '../../hooks/useDetalleGrupo'

const DetalleGrupo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawId = searchParams.get('groupId')
  const groupId = groupBusiness.validateGroupId(rawId)

  // Validar antes de llamar al hook
  if (!groupId) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <p className="mb-4 text-sm text-danger">Grupo no encontrado.</p>
        <button
          onClick={() => navigate('/teacher/grupos')}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={15} />
          Volver a Mis grupos
        </button>
      </div>
    )
  }

  return <DetalleGrupoContent groupId={groupId} />
}

/** Componente interno: solo se monta cuando groupId es válido */
const DetalleGrupoContent = ({ groupId }: { groupId: string }) => {
  const navigate = useNavigate()
  const { isLoading, error } = useDetalleGrupo(groupId)

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/teacher/grupos')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-bodydark1 hover:text-primary"
      >
        <ArrowLeft size={15} />
        Volver
      </button>

      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Detalle del grupo
      </h2>

      {isLoading && (
        <p className="mt-4 text-sm text-bodydark2">Cargando grupo {groupId}...</p>
      )}

      {!isLoading && error && (
        <p className="mt-4 text-sm text-danger">{error}</p>
      )}

      {!isLoading && !error && (
        <p className="mt-4 text-sm text-bodydark2">
          {/* TODO Tarea 11: reemplazar por la vista completa del grupo */}
          Cargando grupo {groupId}...
        </p>
      )}
    </div>
  )
}

export default DetalleGrupo