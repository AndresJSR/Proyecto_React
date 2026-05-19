import React from 'react';

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: { id: string; suggested_semester: number; credits: number }) => void
}

const EditSubjectModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h3 className="text-lg font-semibold">Editar asignatura</h3>
        <div className="mt-4 space-y-3">
          <input placeholder="Semestre sugerido" className="w-full rounded border px-3 py-2" />
          <input type="number" placeholder="Créditos" className="w-full rounded border px-3 py-2" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1">Cancelar</button>
          <button onClick={() => onSave({ id: 'x', suggested_semester: 1, credits: 3 })} className="rounded bg-blue-600 px-3 py-1 text-white">Guardar</button>
        </div>
      </div>
    </div>
  )
}

export default EditSubjectModal
