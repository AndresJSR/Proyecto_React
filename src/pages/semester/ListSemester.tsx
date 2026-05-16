import React, {
  useEffect,
  useState
} from 'react'

import Swal from 'sweetalert2'

import SemesterTable from '../../components/semester/SemesterTable'

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
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Lista de semestres
      </h1>

      <SemesterTable
        semesters={semesters}
        onEdit={(semester) => {
          console.log(semester)
        }}
        onDelete={handleDelete}
      />

    </div>
  )
}

export default ListSemester 