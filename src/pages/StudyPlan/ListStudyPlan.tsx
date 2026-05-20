import { useState } from 'react'

import Swal from 'sweetalert2'

import StudyPlanForm from '../../components/StudyPlan/StudyPlanForm'
import StudyPlanModal from '../../components/StudyPlan/StudyPlanModal'
import StudyPlanTable from '../../components/StudyPlan/StudyPlanTable'

import {
    CreateStudyPlanDto,
    StudyPlan,
    UpdateStudyPlanDto
} from '../../models/StudyPlan'

import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import useStudyPlans from '../../hooks/useStudyPlans'

const ListStudyPlan = () => {
  const { studyPlans, refresh } = useStudyPlans()

  const [loading, setLoading] =
    useState(false)

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedStudyPlan, setSelectedStudyPlan] =
    useState<StudyPlan | null>(null)

  const [formData, setFormData] =
    useState<
      CreateStudyPlanDto | UpdateStudyPlanDto
    >({
      career_id: '',
      subject_id: '',
      name: '',
      year: 2025,
      suggested_semester: 1
    })


  const handleCreate = () => {
    setSelectedStudyPlan(null)

    setFormData({
      career_id: '',
      subject_id: '',
      name: '',
      year: 2025,
      suggested_semester: 1
    })

    setOpenModal(true)
  }

  const handleEdit = (
    studyPlan: StudyPlan
  ) => {
    setSelectedStudyPlan(studyPlan)

    setFormData({
      career_id: studyPlan.career_id,
      subject_id: studyPlan.subject_id,
      name: studyPlan.name,
      year: studyPlan.year,
      suggested_semester:
        studyPlan.suggested_semester
    })

    setOpenModal(true)
  }

  const handleChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      if (selectedStudyPlan) {
        await studyPlanBusiness.updateStudyPlan(
          selectedStudyPlan.id,
          formData as UpdateStudyPlanDto
        )

        Swal.fire(
          'Updated',
          'Study plan updated successfully',
          'success'
        )
      } else {
        await studyPlanBusiness.createStudyPlan(
          formData as CreateStudyPlanDto
        )

        Swal.fire(
          'Created',
          'Study plan created successfully',
          'success'
        )
      }

      setOpenModal(false)

      await refresh()
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.message ||
          'Operation failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (
    studyPlan: StudyPlan
  ) => {
    const result = await Swal.fire({
      title: 'Delete study plan?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    })

    if (!result.isConfirmed) return

    try {
      await studyPlanBusiness.deleteStudyPlan(
        studyPlan.id
      )

      Swal.fire(
        'Deleted',
        'Study plan deleted successfully',
        'success'
      )

      await refresh()
    } catch (error) {
      Swal.fire(
        'Error',
        'Could not delete study plan',
        'error'
      )
    }
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Study Plans
        </h1>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Create Study Plan
        </button>
      </div>

      <StudyPlanTable
        studyPlans={studyPlans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StudyPlanModal
        isOpen={openModal}
        title={
          selectedStudyPlan
            ? 'Edit Study Plan'
            : 'Create Study Plan'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <StudyPlanForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </StudyPlanModal>
    </div>
  )
}

export default ListStudyPlan