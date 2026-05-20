import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useInscripciones from '../../hooks/useInscripciones';
import { inscripcionService } from '../../services/inscripcionService';

const ListRegistration: React.FC = () => {
    const navigate = useNavigate();
    const { inscripciones, loading, error, refresh } = useInscripciones();

    const handleAction = async (action: string, item: Record<string, any>) => {
        if (action === 'edit') {
            navigate(`/registrations/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: 'Delete registration?',
                text: `Student: ${item.alumnoNombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
            });
            if (result.isConfirmed) {
                const success = await inscripcionService.deleteInscripcion(item.id);
                if (success) {
                    await Swal.fire('Deleted', 'Registration deleted successfully.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Registrations</h2>
                <button
                    onClick={() => navigate('/registrations/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Create Registration
                </button>
            </div>
            {loading && <p>Loading registrations...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={inscripciones}
                columnas={['id', 'alumnoNombre', 'asignaturaId', 'grupoId', 'fechaInscripcion', 'estado']}
                acciones={[{ name: 'edit', label: 'Edit' }, { name: 'delete', label: 'Delete' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListRegistration;
            ? 'Edit Registration'
            : 'Create Registration'
        }
        onClose={() =>
          setOpenModal(false)
        }
      >
        <RegistrationForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </RegistrationModal>
    </div>
  )
}

export default ListRegistration