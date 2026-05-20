// src/pages/Career/ListCareer.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { registrationBusiness } from '../../business/RegistrationBusiness';
import { semesterBusiness } from '../../business/SemesterBusiness';
import { studyPlanBusiness } from '../../business/StudyPlanBusiness';

import CareerDetailModal from '../../components/Career/CareerModal';
import ArchiveCareerModal from '../../components/Career/modal/ArchiveCareerModal';

import CareerForm from '../../components/Career/CareerForm';
import CareerModal from '../../components/Career/CareerModal';
import CareerTable from '../../components/Career/CareerTable';

import { Career, CreateCareerDto, UpdateCareerDto } from '../../models/Career';

import { Semester } from '../../models/Semester';

import { careerBusiness } from '../../business/CareerBusiness';

interface CareerSectionContentProps {
  hideSectionTitle?: boolean;
}

const CareerSectionContent = ({
  hideSectionTitle = false,
}: CareerSectionContentProps) => {
  const [careers, setCareers] = useState<Career[]>([]);

  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  const [detailCareer, setDetailCareer] = useState<Career | null>(null);

  const [detailSemesters, setDetailSemesters] = useState<Semester[]>([]);

  const [detailStudentCount, setDetailStudentCount] = useState(0);

  const [detailStudyPlanCount, setDetailStudyPlanCount] = useState(0);

  const [formData, setFormData] = useState<CreateCareerDto | UpdateCareerDto>({
    name: '',
    code: '',
    description: '',
  });

  const loadCareers = async () => {
    setLoading(true);

    try {
      const data = await careerBusiness.getCareers();

      setCareers(data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Error al cargar carreras',
        text: 'No se pudieron cargar las carreras',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  const handleCreate = () => {
    setSelectedCareer(null);

    setFormData({
      name: '',
      code: '',
      description: '',
    });

    setOpenModal(true);
  };

  const handleEdit = (career: Career) => {
    setSelectedCareer(career);

    setFormData({
      name: career.name,
      code: career.code,
      description: career.description || '',
    });

    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Archivar carrera?',
      text: 'Se archivará la carrera (no será eliminada físicamente).',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Archivar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await careerBusiness.deleteCareer(id);

      await Swal.fire({
        icon: 'success',
        title: 'Carrera archivada',
        text: 'La carrera se archivó correctamente',
      });

      loadCareers();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo archivar la carrera',
      });
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedCareer) {
        await careerBusiness.updateCareer(
          selectedCareer.id,
          formData as UpdateCareerDto,
        );

        await Swal.fire({
          icon: 'success',
          title: 'Carrera actualizada',
          text: 'La carrera se actualizó correctamente',
        });
      } else {
        await careerBusiness.createCareer(formData as CreateCareerDto);

        await Swal.fire({
          icon: 'success',
          title: 'Carrera creada',
          text: 'La carrera se creó correctamente',
        });
      }

      setOpenModal(false);

      loadCareers();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Operación fallida',
      });
    }
  };

  const [archiveOpen, setArchiveOpen] = useState(false);

  const [archiveCareer, setArchiveCareer] = useState<Career | null>(null);

  const [archiveActiveSemesters, setArchiveActiveSemesters] = useState<
    { name: string; period: string }[]
  >([]);

  const handleArchiveOpen = async (career: Career) => {
    setArchiveCareer(career);

    try {
      const semesters = await semesterBusiness.getSemesters();

      const active = semesters
        .filter((s) => s.career_id === career.id && s.is_active)
        .slice(0, 3)
        .map((s) => ({
          name: s.name,
          period: `${s.start_date} - ${s.end_date}`,
        }));

      setArchiveActiveSemesters(active);
    } catch (err) {
      setArchiveActiveSemesters([]);
    }

    setArchiveOpen(true);
  };

  const handleView = async (career: Career) => {
    setDetailCareer(career);

    try {
      const [semesters, registrations, studyPlans] = await Promise.all([
        semesterBusiness.getSemesters(),
        registrationBusiness.getRegistrations(),
        studyPlanBusiness.getStudyPlans(),
      ]);

      const associatedSemesters = semesters.filter(
        (semester) => semester.career_id === career.id,
      );

      setDetailSemesters(associatedSemesters);

      setDetailStudentCount(
        registrations.filter(
          (registration) =>
            registration.career_id === career.id && registration.is_active,
        ).length,
      );

      setDetailStudyPlanCount(
        studyPlans.filter((studyPlan) => studyPlan.career_id === career.id)
          .length,
      );
    } catch (error) {
      console.error(error);
    }

    setDetailOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!archiveCareer) return;

    try {
      await careerBusiness.deleteCareer(archiveCareer.id);

      Swal.fire({
        icon: 'success',
        title: 'Carrera archivada',
        text: 'La carrera se archivó correctamente',
      });

      setArchiveOpen(false);
      setArchiveCareer(null);

      loadCareers();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error?.message ||
          'No se pudo archivar la carrera. Revisa si tiene semestres activos o estudiantes matriculados.',
      });
    }
  };

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción', render: (item: Career) => item.description || '-' },
    {
      key: 'is_active',
      label: 'Estado',
      render: (item: Career) => (item.is_active ? 'Activo' : 'Inactivo')
    }
  ]

  return (
    <>
      {!hideSectionTitle && (
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
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + Nueva carrera
          </button>
        </div>
      )}

      <div className="mb-8">
        <CareerTable
          careers={careers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchiveOpen}
          onView={handleView}
        />

        {careers.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No hay carreras registradas
          </div>
        )}
      </div>

      {/* barra de búsqueda */}

      <GenericTable<Career>
        data={careers}
        columns={columns}
        renderActions={(item) => (
          <ActionDropdown
            items={[
              {
                key: 'edit',
                label: 'Editar carrera',
                onClick: () => handleEdit(item),
                icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z"
                    />
                  </svg>
                )
              },
              {
                key: 'view',
                label: 'Ver detalle',
                onClick: () => handleView(item),
                icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"
                    />
                  </svg>
                )
              },
              {
                key: 'archive',
                label: 'Archivar carrera',
                onClick: () => handleArchiveOpen(item),
                colorClass: 'text-yellow-600',
                icon: (
                  <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7"
                    />
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 7V5a3 3 0 016 0v2"
                    />
                  </svg>
                )
              }
            ]}
            align="right"
          />
        )}
      />

      {careers.length === 0 && (
        <div className="py-8 text-center text-gray-500">No hay carreras registradas</div>
      )}

      {/* modales */}

      <CareerModal
        isOpen={openModal}
        title={selectedCareer ? 'Editar carrera' : 'Nueva carrera'}
        onClose={() => setOpenModal(false)}
      >
        <CareerForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </CareerModal>

      <CareerDetailModal
        isOpen={detailOpen}
        career={detailCareer}
        associatedSemesters={detailSemesters}
        totalStudents={detailStudentCount}
        totalStudyPlans={detailStudyPlanCount}
        onClose={() => setDetailOpen(false)}
      />

      <ArchiveCareerModal
        isOpen={archiveOpen}
        career={archiveCareer}
        activeSemesters={archiveActiveSemesters}
        onClose={() => setArchiveOpen(false)}
        onConfirm={handleConfirmArchive}
      />
    </>
  );
};

export const CareerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Académico
          </p>

          <h2 className="mt-1 text-xl font-semibold text-gray-900">Carreras</h2>

          <p className="mt-2 text-sm text-gray-600">
            Administra la oferta académica disponible.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/carreras/create')}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-black hover:bg-gray-700"
        >
          + Nueva carrera
        </button>
      </div>

      <CareerSectionContent hideSectionTitle />
    </section>
  );
};

const ListCareer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Académico</h1>

              <p className="mt-2 text-gray-600">
                Gestiona las carreras y los semestres del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CareerSection />
      </div>
    </div>
  );
};

export default ListCareer;
