import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useCarreras from '../../hooks/useCareer';
import { Career } from '../../models/Career';
import { careerService } from '../../services/careerService';

const ListCareers: React.FC = () => {
    const navigate = useNavigate();
    const { careers, loading, error, refresh } = useCarreras();

    const handleAction = async (action: string, item: any) => {
        const career = item as Career;
        if (action === 'edit') {
            navigate(`/carreras/edit/${career.id}`);
        }
        if (action === 'delete' && career.id) {
            const result = await Swal.fire({
                title: '¿Eliminar carrera?',
                text: `Carrera: ${item.name}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                try {
                    await careerService.deleteCareer(item.id);
                    await Swal.fire('Eliminada', 'La carrera fue eliminada.', 'success');
                    refresh();
                } catch (err) {
                    await Swal.fire('Error', 'No se pudo eliminar la carrera.', 'error');
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Carreras</h2>
                <button
                    onClick={() => navigate('/carreras/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Carrera
                </button>
            </div>
            {loading && <p>Cargando carreras...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={careers}
                columnas={['id', 'name', 'code', 'description']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListCareers;
