import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useAsignaturas from '../../hooks/useAsignaturas';
import { asignaturaService } from '../../services/subjectService';

const ListSubjects: React.FC = () => {
    const navigate = useNavigate();
    const { asignaturas, loading, error, refresh } = useAsignaturas();

    const handleAction = async (action: string, item: Record<string, any>) => {
        if (action === 'edit') {
            navigate(`/asignaturas/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: 'Delete subject?',
                text: `Subject: ${item.nombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
            });
            if (result.isConfirmed) {
                const success = await asignaturaService.deleteAsignatura(item.id);
                if (success) {
                    await Swal.fire('Deleted', 'Subject deleted successfully.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Subjects</h2>
                <button
                    onClick={() => navigate('/asignaturas/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Create Subject
                </button>
            </div>
            {loading && <p>Loading subjects...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={asignaturas}
                columnas={['id', 'nombre', 'codigo', 'creditos', 'semestreId', 'carreraId', 'optativa']}
                acciones={[{ name: 'edit', label: 'Edit' }, { name: 'delete', label: 'Delete' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListSubjects;
