import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useCarreras from '../../hooks/useCarreras';
import { Carrera } from '../../models/Carrera';
import { carreraService } from '../../services/carreraService';

const ListCarreras: React.FC = () => {
    const navigate = useNavigate();
    const { carreras, loading, error, refresh } = useCarreras();

    const handleAction = async (action: string, item: Carrera) => {
        if (action === 'edit') {
            navigate(`/carreras/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar carrera?',
                text: `Carrera: ${item.nombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await carreraService.deleteCarrera(item.id);
                if (success) {
                    await Swal.fire('Eliminada', 'La carrera fue eliminada.', 'success');
                    refresh();
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
                datos={carreras}
                columnas={['id', 'nombre', 'codigo', 'creditosTotales']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListCarreras;
