import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { studyPlanBusiness } from '../../business/StudyPlanBusiness'
import AddSubjectModal from '../../components/StudyPlan/AddSubjectModal'
import DeleteSubjectModal from '../../components/StudyPlan/DeleteSubjectModal'
import PublishVersionModal from '../../components/StudyPlan/PublishVersionModal'
import StudyPlanCatalog from '../../components/StudyPlan/StudyPlanCatalog'
import StudyPlanDetailsCard from '../../components/StudyPlan/StudyPlanDetailsCard'
import StudyPlanForm from '../../components/StudyPlan/StudyPlanForm'
import StudyPlanModal from '../../components/StudyPlan/StudyPlanModal'
import StudyPlanSection from '../../components/StudyPlan/StudyPlanSection'
import StudyPlanVersionPanel from '../../components/StudyPlan/StudyPlanVersionPanel'
import useCarreras from '../../hooks/useCareer'
import useStudyPlans from '../../hooks/useStudyPlans'
import { StudyPlan } from '../../models/StudyPlan'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'
import { Subject } from '../../models/Subject'
import { studyPlanVersionService } from '../../services/studyPlanVersionService'
import { subjectService } from '../../services/subjectService'

const StudyPlanDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { studyPlans, refresh: refreshPlans } = useStudyPlans()
  const { careers } = useCarreras()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [versions, setVersions] = useState<StudyPlanVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<StudyPlanVersion | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [selectedEditPlan, setSelectedEditPlan] = useState<StudyPlan | null>(null)
  const [selectedDeletePlan, setSelectedDeletePlan] = useState<StudyPlan | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    career_id: '',
    subject_id: '',
    name: '',
    year: new Date().getFullYear(),
    suggested_semester: 1
  })
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (careers.length > 0 && !selectedCareerId) {
      setSelectedCareerId(careers[0].code)
    }
  }, [careers, selectedCareerId])

  useEffect(() => {
    if (selectedCareerId) {
      loadVersions(selectedCareerId)
    }
  }, [selectedCareerId])

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (versions.length > 0 && !selectedVersion) {
      const published = versions.find((version) => version.is_published)
      setSelectedVersion(published || versions[0])
    }
  }, [versions, selectedVersion])

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getSubjects()
      setSubjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadVersions = async (careerId: string) => {
    try {
      const data = await studyPlanVersionService.getVersionsByCareer(careerId)
      setVersions(data)
      const published = data.find((version) => version.is_published)
      setSelectedVersion(published || data[0] || null)
    } catch (error) {
      console.error(error)
    }
  }

  const careerOptions = careers
  const filteredSubjects = subjects.filter((subject) => {
    const query = subjectSearch.trim().toLowerCase()
    return (
      !query ||
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query)
    )
  })

  const currentPlanItems = studyPlans
    .filter(
      (plan) =>
        plan.career_id === selectedCareerId &&
        (!selectedVersion || plan.year === selectedVersion.year)
    )
    .map((plan) => ({
      ...plan,
      subject: subjects.find((subject) => subject.id === plan.subject_id) || plan.subject
    }))

  const currentCareer = careers.find((career) => career.code === selectedCareerId)

  const handleSelectCareer = (careerCode: string) => {
    setSelectedCareerId(careerCode)
    setSelectedVersion(null)
  }

  const handleSelectVersion = (version: StudyPlanVersion) => {
    setSelectedVersion(version)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpenAddModal = (subject: Subject) => {
    setSelectedSubject(subject)
    setOpenAdd(true)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddSubject = async (payload: { subject_id: string; suggested_semester: number; credits: number }) => {
    if (!selectedCareerId || !selectedVersion) {
      Swal.fire({ icon: 'warning', title: 'Seleccione una carrera y versión antes de agregar' })
      return
    }

    const subject = subjects.find((subject) => subject.id === payload.subject_id)
    const selectedSubjectCode = subject?.code || subject?.name || payload.subject_id

    try {
      await studyPlanBusiness.createStudyPlan({
        career_id: selectedCareerId,
        subject_id: payload.subject_id,
        name: selectedSubjectCode,
        year: selectedVersion.year,
        suggested_semester: payload.suggested_semester
      })

      Swal.fire({ icon: 'success', title: 'Asignatura agregada', text: 'Se agregó la asignatura al plan.' })
      setOpenAdd(false)
      setSelectedSubject(null)
      await refreshPlans()
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo agregar', text: error?.message || 'Ocurrió un error al agregar la asignatura' })
    }
  }

  const handleEditClick = (plan: StudyPlan) => {
    setSelectedEditPlan(plan)
    setEditFormData({
      career_id: plan.career_id,
      subject_id: plan.subject_id ?? '',
      name: plan.name,
      year: plan.year,
      suggested_semester: plan.suggested_semester
    })
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUpdatePlan = async () => {
    if (!selectedEditPlan) return

    try {
      await studyPlanBusiness.updateStudyPlan(selectedEditPlan.id, editFormData)
      Swal.fire({ icon: 'success', title: 'Plan actualizado', text: 'Los cambios han sido guardados.' })
      setSelectedEditPlan(null)
      await refreshPlans()
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: error?.message || 'Ocurrió un error al guardar los cambios' })
    }
  }

  const handleDeleteClick = (plan: StudyPlan) => {
    setSelectedDeletePlan(plan)
  }

  const handlePublish = async (year: number) => {
    if (!selectedCareerId) {
      Swal.fire({ icon: 'warning', title: 'Seleccione una carrera' })
      return
    }

    try {
      const version = await studyPlanBusiness.createVersion({
        career_id: selectedCareerId,
        year,
        name: `Versión ${year}`
      })
      await studyPlanBusiness.publishVersion(version.id, { career_id: selectedCareerId, replace_previous: true })

      Swal.fire({ icon: 'success', title: 'Versión publicada', text: 'La nueva versión ha reemplazado a la anterior.' })
      setPublishOpen(false)
      await loadVersions(selectedCareerId)
      await refreshPlans()
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'No se pudo publicar', text: error?.message || 'Verifica el contenido del plan antes de publicar.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plan de estudios</h1>
              <p className="mt-2 text-gray-600">Define y versiona las asignaturas por semestre de cada carrera.</p>
              {selectedVersion ? (
                <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
                  <span className="font-semibold">Versión activa:</span>
                  <span>{selectedVersion.year}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-green-800 shadow-sm">{selectedVersion.is_published ? 'Publicado' : 'Borrador'}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Carrera</label>
                <select
                  value={selectedCareerId}
                  onChange={(e) => handleSelectCareer(e.target.value)}
                  className="mt-1 w-full rounded border-gray-200 bg-white px-2 py-2 text-sm text-gray-700"
                >
                  <option value="">Seleccione una carrera</option>
                  {careerOptions.map((career) => (
                    <option key={career.id} value={career.code}>{career.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700"
                >
                  Nueva versión
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/study-plans/versions')}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Historial de versiones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <StudyPlanCatalog
              subjects={filteredSubjects}
              search={subjectSearch}
              onSearch={setSubjectSearch}
              onAdd={handleOpenAddModal}
            />
          </div>

          <div className="col-span-12 lg:col-span-6" ref={sectionRef}>
            <StudyPlanSection
              planItems={currentPlanItems}
              careerName={currentCareer?.name}
              version={selectedVersion}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <StudyPlanDetailsCard
              careerName={currentCareer?.name}
              version={selectedVersion}
              planItems={currentPlanItems}
            />
            <StudyPlanVersionPanel
              versions={versions}
              selectedVersionId={selectedVersion?.id}
              onSelectVersion={handleSelectVersion}
            />
          </div>
        </div>
      </div>

      <AddSubjectModal
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        subject={selectedSubject}
        careerName={currentCareer?.name}
        versionYear={selectedVersion?.year}
        onAdd={handleAddSubject}
      />

      <StudyPlanModal
        isOpen={Boolean(selectedEditPlan)}
        title="Editar asignatura del plan"
        onClose={() => setSelectedEditPlan(null)}
      >
        <StudyPlanForm
          formData={editFormData}
          onChange={(field, value) => setEditFormData((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleUpdatePlan}
          loading={false}
        />
      </StudyPlanModal>

      <DeleteSubjectModal
        isOpen={Boolean(selectedDeletePlan)}
        onClose={() => setSelectedDeletePlan(null)}
        planId={selectedDeletePlan?.id}
        subjectId={selectedDeletePlan?.subject_id}
        onRemoved={async () => await refreshPlans()}
      />

      <PublishVersionModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  )
}

export default StudyPlanDashboardPage
"No eso es obcional, d"