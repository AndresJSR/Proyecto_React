import { useState } from 'react'
import { Link } from 'react-router-dom'

import AddSubjectModal from './components/AddSubjectModal'
import CatalogPanel from './components/CatalogPanel'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import EditSubjectModal from './components/EditSubjectModal'
import PublishPlanModal from './components/PublishPlanModal'
import RestrictedDeleteModal from './components/RestrictedDeleteModal'
import StudyPlanSummary from './components/StudyPlanSummary'
import StudyPlanTable from './components/StudyPlanTable'
import useStudyPlan from '../../hooks/useStudyPlan'

const PlanEstudios = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'drafts'>('structure')

  const {
    careers,
    selectedCareerId,
    studyPlans,
    activePlan,
    selectedPlanId,
    planSubjects,
    availableSubjects,
    searchQuery,
    subjectsBySemester,
    totalCredits,
    loading,
    loadingAction,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isPublishModalOpen,
    isRestrictedDeleteModalOpen,
    selectedSubjectForAction,
    formSubjectId,
    formSemester,
    formCredits,
    publishYear,
    handleSelectCareer,
    handleSelectPlan,
    handleSearchChange,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenPublishModal,
    handleCloseAllModals,
    handleAddSubject,
    handleEditSubject,
    handleDeleteSubject,
    handlePublishPlan,
    setFormSubjectId,
    setFormSemester,
    setFormCredits,
    setPublishYear,
  } = useStudyPlan()

  const selectedCareer = careers.find((career) => Number(career.id) === selectedCareerId)
  const selectedPlan =
    studyPlans.find((plan) => Number(plan.id) === selectedPlanId) ?? activePlan ?? studyPlans[0]
  const draftPlans = studyPlans.filter((plan) => !plan.is_published)
  const showInitialLoader = loading && !selectedPlanId

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Plan de estudios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Define y versiona las asignaturas por semestre de cada carrera.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="font-medium text-gray-600 hover:text-green-600">
              Inicio
            </Link>
            <span>›</span>
            <Link to="/plan-estudios" className="font-medium text-gray-600 hover:text-green-600">
              Plan de estudios
            </Link>
            <span>›</span>
            <span className="font-semibold text-gray-900">
              {selectedCareer?.name || 'Sin carrera seleccionada'}
            </span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById('version-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-200 hover:text-green-700"
          >
            Historial de versiones
          </button>

          <button
            type="button"
            onClick={handleOpenPublishModal}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Nueva versión
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] xl:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Carrera</span>
            <select
              value={selectedCareerId ?? ''}
              onChange={(event) => handleSelectCareer(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="" disabled>
                Selecciona una carrera
              </option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>
                  {career.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Versión activa</span>
            <div className="flex items-center gap-3">
              <select
                value={selectedPlanId ?? ''}
                onChange={(event) => handleSelectPlan(Number(event.target.value))}
                disabled={!selectedCareerId || studyPlans.length === 0}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="" disabled>
                  {selectedCareerId ? 'Selecciona una versión' : 'Selecciona una carrera primero'}
                </option>
                {studyPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name || `Versión ${plan.year}`}
                  </option>
                ))}
              </select>

              <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${selectedPlan?.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {selectedPlan ? (selectedPlan.is_published ? 'Publicado' : 'Borrador') : '—'}
              </span>
            </div>
          </label>

          <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('structure')}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${activeTab === 'structure' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:text-green-700'}`}
            >
              Estructura del plan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drafts')}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${activeTab === 'drafts' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:text-green-700'}`}
            >
              Borradores
            </button>
          </div>
        </div>
      </div>

      {showInitialLoader ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            <span className="text-sm font-medium text-gray-600">Cargando plan de estudios...</span>
          </div>
        </div>
      ) : activeTab === 'structure' ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr_1fr]">
          <div>
            <CatalogPanel
              subjects={availableSubjects}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onAddSubject={handleOpenAddModal}
            />
          </div>

          <div className="space-y-4">
            {!selectedCareerId ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                Selecciona una carrera para ver su plan de estudios.
              </div>
            ) : (
              <StudyPlanTable
                subjectsBySemester={subjectsBySemester}
                planName={selectedPlan?.name || 'Plan de estudios'}
                isPublished={selectedPlan?.is_published ?? false}
                totalSubjects={planSubjects.length}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            )}
          </div>

          <div id="version-history">
            <StudyPlanSummary
              plan={selectedPlan}
              career={selectedCareer}
              totalSubjects={planSubjects.length}
              totalCredits={totalCredits}
              allPlans={studyPlans}
              onSelectPlan={handleSelectPlan}
              onPublish={handleOpenPublishModal}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Borradores</h2>
              <p className="mt-1 text-sm text-gray-500">Revisa las versiones no publicadas de la carrera activa.</p>
            </div>
          </div>

          {draftPlans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No hay borradores disponibles para esta carrera.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {draftPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(Number(plan.id))}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-green-200 hover:bg-green-50/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{plan.name || `Versión ${plan.year}`}</p>
                      <p className="mt-1 text-xs text-gray-500">Año {plan.year}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Borrador
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <AddSubjectModal
        isOpen={isAddModalOpen}
        availableSubjects={filteredSubjects}
        formSubjectId={formSubjectId}
        formSemester={formSemester}
        formCredits={formCredits}
        onSubjectChange={setFormSubjectId}
        onSemesterChange={setFormSemester}
        onCreditsChange={setFormCredits}
        onConfirm={handleAddSubject}
        onCancel={handleCloseAllModals}
        loadingAction={loadingAction}
      />

      <EditSubjectModal
        isOpen={isEditModalOpen}
        subject={selectedSubjectForAction}
        formSemester={formSemester}
        formCredits={formCredits}
        onSemesterChange={setFormSemester}
        onCreditsChange={setFormCredits}
        onConfirm={handleEditSubject}
        onCancel={handleCloseAllModals}
        loadingAction={loadingAction}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        subject={selectedSubjectForAction}
        onConfirm={handleDeleteSubject}
        onCancel={handleCloseAllModals}
        loadingAction={loadingAction}
      />

      <RestrictedDeleteModal
        isOpen={isRestrictedDeleteModalOpen}
        subject={selectedSubjectForAction}
        onClose={handleCloseAllModals}
      />

      <PublishPlanModal
        isOpen={isPublishModalOpen}
        careerName={selectedCareer?.name || ''}
        currentYear={selectedPlan?.year}
        publishYear={publishYear}
        onYearChange={setPublishYear}
        onConfirm={handlePublishPlan}
        onCancel={handleCloseAllModals}
        loadingAction={loadingAction}
      />
    </div>
  )
}

export default PlanEstudios