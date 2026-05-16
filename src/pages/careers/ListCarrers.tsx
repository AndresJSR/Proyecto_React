// src/pages/Career/ListCareer.tsx

import { useEffect, useState } from 'react'

import Swal from 'sweetalert2'

import CareerModal from '../../components/Career/CareerModal'
import CareerTable from '../../components/Career/CarrerTable'
import CareerForm from '../../components/Career/CareerForm'

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
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Careers
        </h1>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Create Career
        </button>
      </div>

      <CareerTable
        careers={careers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CareerModal
        isOpen={openModal}
        title={
          selectedCareer
            ? 'Edit Career'
            : 'Create Career'
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