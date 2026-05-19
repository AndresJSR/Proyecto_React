import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import useStudyPlans from '../../hooks/useStudyPlans'

interface Props {
  isOpen: boolean
  onClose: () => void
  planId?: string
  subjectId?: string
  onRemoved?: () => void
  reason?: string
}

const DeleteSubjectModal: React.FC<Props> = ({ isOpen, onClose, planId, subjectId, onRemoved, reason: initialReason }) => {
  const [reason, setReason] = useState<string | undefined>(initialReason)
  const { refresh } = useStudyPlans()

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!planId || !subjectId) {
      setReason('Falta información del plan o asignatura')
      return
    }

    try {
      await studyPlanBusiness.removeSubjectFromPlan(planId, subjectId)

      Swal.fire({ icon: 'success', title: 'Eliminado', text: 'La asignatura fue eliminada del plan' })

      onRemoved && onRemoved()
      await refresh()
      onClose()
    } catch (err: any) {
      setReason(err?.message || 'No se pudo eliminar la asignatura')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h3 className="text-lg font-semibold">Eliminar asignatura</h3>
        <div className="mt-4 text-sm text-gray-700">
          {reason ? (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-3">{reason}</div>
          ) : (
            <p>¿Seguro que desea eliminar la asignatura del plan?</p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1">Cancelar</button>
          {!reason && <button onClick={handleConfirm} className="rounded bg-red-600 px-3 py-1 text-white">Eliminar</button>}
        </div>
      </div>
    </div>
  )
}

export default DeleteSubjectModal
