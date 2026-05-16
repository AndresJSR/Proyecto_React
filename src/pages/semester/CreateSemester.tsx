import React, { useState } from 'react'
import Swal from 'sweetalert2'

import SemesterForm from '../../components/Semester/SemesterForm'
import SemesterModal from '../../components/Semester/SemesterModal'

import {
    CreateSemesterDto
} from '../../models/Semester'

import {
    semesterBusiness
} from '../../business/SemesterBusiness'

const CreateSemester: React.FC = () => {

  const [open, setOpen] =
    useState<boolean>(false)

  const [formData, setFormData] =
    useState<CreateSemesterDto>({
      name: '',
      code: '',
      start_date: '',
      end_date: ''
    })

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

      await semesterBusiness.createSemester(
        formData
      )

      Swal.fire({
        icon: 'success',
        title: 'Semester created successfully'
      })

      setOpen(false)

      setFormData({
        name: '',
        code: '',
        start_date: '',
        end_date: ''
      })

    } catch (error: any) {

      Swal.fire({
        icon: 'error',
        title: error.message
      })
    }
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Semester Management
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Semester
        </button>

      </div>

      <SemesterModal
        isOpen={open}
        title="Create Semester"
        onClose={() => setOpen(false)}
      >

        <SemesterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

      </SemesterModal>

    </div>
  )
}

export default CreateSemester