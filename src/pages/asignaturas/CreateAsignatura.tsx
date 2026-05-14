import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Asignatura } from '../../models/Asignatura';
import { asignaturaService } from '../../services/asignaturaService';

const CreateAsignatura: React.FC = () => {
    const navigate = useNavigate();
    const [asignatura, setAsignatura] = useState<Asignatura>(new Asignatura());

    const handleChange = (field: keyof Asignatura, value: string | number | boolean) => {
        setAsignatura((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            nombre: asignatura.nombre,
            codigo: asignatura.codigo,
            creditos: asignatura.creditos,
            semestreId: asignatura.semestreId,
            carreraId: asignatura.carreraId,
            optativa: asignatura.optativa,
        };

        const created = await asignaturaService.createAsignatura(payload);
        if (created) {
            await Swal.fire('Creado', 'La asignatura fue creada con éxito.', 'success');
            navigate('/asignaturas/list');
        } else {
            await Swal.fire('Error', 'No se pudo crear la asignatura.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Asignatura</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                        value={asignatura.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Código</label>
                    <input
                        value={asignatura.codigo}
                        onChange={(e) => handleChange('codigo', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Créditos</label>
                    <input
                        type="number"
                        value={asignatura.creditos}
                        onChange={(e) => handleChange('creditos', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Semestre ID</label>
                    <input
                        type="number"
                        value={asignatura.semestreId ?? ''}
                        onChange={(e) => handleChange('semestreId', e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Carrera ID</label>
                    <input
                        type="number"
                        value={asignatura.carreraId ?? ''}
                        onChange={(e) => handleChange('carreraId', e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <input
                        id="optativa"
                        type="checkbox"
                        checked={asignatura.optativa}
                        onChange={(e) => handleChange('optativa', e.target.checked)}
                    />
                    <label htmlFor="optativa" className="text-sm">Optativa</label>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/asignaturas/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Asignatura
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAsignatura;
