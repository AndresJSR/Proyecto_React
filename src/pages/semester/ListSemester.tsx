import React, {
  useEffect,
  useState
} from 'react'

import Swal from 'sweetalert2'

import SemesterTable from '../../components/Semester/SemesterTable'

import {
  Semester
} from '../../models/Semester'

import {
  semesterBusiness
} from '../../business/SemesterBusiness'

const ListSemester: React.FC = () => {

  const [semesters, setSemesters] =
    useState<Semester[]>([])

  const loadSemesters = async () => {

    try {

      const data =
        await semesterBusiness.getSemesters()

      setSemesters(data)

    } catch (error: any) {

      Swal.fire({
        icon: 'error',
        title: error.message
      })

    }
  }

  useEffect(() => {
    loadSemesters()
  }, [])

  const handleDelete = async (
    id: string
  ) => {

    try {

      await semesterBusiness.deleteSemester(id)

      Swal.fire({
        icon: 'success',
        title: 'Semestre eliminado'
      })

      loadSemesters()

    } catch (error: any) {

      Swal.fire({
        icon: 'error',
        title: error.message
      })

    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Académico</h1>
              <p className="mt-2 text-gray-600">Gestiona las carreras y los semestres del sistema.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Action Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <input
              type="text"
              placeholder="Buscar semestre por nombre o código..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              🔍 Filtros
            </button>
          </div>
          <button
            className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 flex items-center gap-2"
          >
            + Nuevo semestre
          </button>
        </div>

        {/* Semestres Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Semestres</h2>
          <SemesterTable
            semesters={semesters}
            onEdit={(semester) => {
              console.log(semester)
            }}
            onDelete={handleDelete}
          />
          {semesters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay semestres registrados
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListSemester 