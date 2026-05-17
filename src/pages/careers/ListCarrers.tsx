// src/pages/Career/ListCareer.tsx

import { useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import CareerForm from '../../components/Career/CareerForm'
import CareerModal from '../../components/Career/CareerModal'
import CareerTable from '../../components/Career/CarrerTable'

import {
  Career,
  CreateCareerDto,
  UpdateCareerDto
} from '../../models/Career'

import { careerBusiness } from '../../business/CareerBusiness'

const ListCareer = () => {
  const [careers, setCareers] =
    useState<Career[]>([])

  const [loading, setLoading] =
    useState(false)

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedCareer, setSelectedCareer] =
    useState<Career | null>(null)

  const [formData, setFormData] =
    useState<
      CreateCareerDto | UpdateCareerDto
    >({
      name: '',
      code: '',
      description: ''
    })

  const loadCareers = async () => {
    setLoading(true)

    try {
      const data =
        await careerBusiness.getCareers()

      setCareers(data)
    } catch (error) {
      console.error(error)

      Swal.fire(
        'Error',
        'Could not load careers',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCareers()
  }, [])

  const handleCreate = () => {
    setSelectedCareer(null)

    setFormData({
      name: '',
      code: '',
      description: ''
    })

    setOpenModal(true)
  }

  const handleEdit = (
    career: Career
  ) => {
    setSelectedCareer(career)

    setFormData({
      name: career.name,
      code: career.code,
      description:
        career.description || ''
    })

    setOpenModal(true)
  }

 const handleDelete = async (
  id: string
) => {
  const result = await Swal.fire({
    title: 'Delete career?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete'
  })

  if (!result.isConfirmed) return

  try {
    await careerBusiness.deleteCareer(id)

    await Swal.fire(
      'Deleted',
      'Career deleted successfully',
      'success'
    )

    loadCareers()
  } catch (error) {
    console.error(error)

    Swal.fire(
      'Error',
      'Could not delete career',
      'error'
    )
  }
}

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (selectedCareer) {
        await careerBusiness.updateCareer(
          selectedCareer.id,
          formData as UpdateCareerDto
        )

        Swal.fire(
          'Updated',
          'Career updated successfully',
          'success'
        )
      } else {
        await careerBusiness.createCareer(
          formData as CreateCareerDto
        )

        Swal.fire(
          'Created',
          'Career created successfully',
          'success'
        )
      }

      setOpenModal(false)

      loadCareers()
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Operation failed',
        'error'
      )
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
              placeholder="Buscar carrera por nombre o código..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              🔍 Filtros
            </button>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 flex items-center gap-2"
          >
            + Nueva carrera
          </button>
        </div>

        {/* Carreras Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Carreras</h2>
          <CareerTable
            careers={careers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {careers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay carreras registradas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CareerModal
        isOpen={openModal}
        title={
          selectedCareer
            ? 'Editar carrera'
            : 'Nueva carrera'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <CareerForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </CareerModal>
    </div>
  )
}

export default ListCareer