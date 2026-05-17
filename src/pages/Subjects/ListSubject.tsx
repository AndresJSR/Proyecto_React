import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubject } from '../../hooks/useSubject'
import SubjectTable from '../../components/Subject/SubjectTable'

const ListSubject = () => {
  const navigate = useNavigate()
  const {
    subjects,
    loading,
    error,
    fetchSubjects,
    deleteSubject
  } = useSubject()

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleCreate = () => {
    navigate('/asignaturas/create')
  }

  const handleEdit = (subject: any) => {
    navigate(`/asignaturas/edit/${subject.id}`)
  }

  const handleDelete = async (id: string) => {
    await deleteSubject(id)
    fetchSubjects()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lista de Asignaturas</h1>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Crear Asignatura
        </button>
      </div>
      {loading && <p>Cargando asignaturas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default ListSubject
