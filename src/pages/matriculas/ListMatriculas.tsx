import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useMatriculas from '../../hooks/useMatriculas';
import { Matricula } from '../../models/Matricula';
import { matriculaService } from '../../services/matriculaService';

const ListMatriculas: React.FC = () => {
    const navigate = useNavigate();
    const { matriculas, loading, error, refresh } = useMatriculas();

    const handleAction = async (action: string, item: Matricula) => {
        if (action === 'edit') {
            navigate(`/matriculas/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar matrícula?',
                text: `Alumno: ${item.alumnoNombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await matriculaService.deleteMatricula(item.id);
                if (success) {
                    await Swal.fire('Eliminada', 'La matrícula fue eliminada.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Matrículas</h2>
                <button
                    onClick={() => navigate('/matriculas/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Matrícula
                </button>
            </div>
            {loading && <p>Cargando matrículas...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={matriculas}
                columnas={['id', 'alumnoNombre', 'carreraId', 'semestreId', 'fechaMatricula', 'estado']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListMatriculas;
