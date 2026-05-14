import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Inscripcion } from '../../models/Inscripcion';
import { inscripcionService } from '../../services/inscripcionService';

const CreateInscripcion: React.FC = () => {
    const navigate = useNavigate();
    const [inscripcion, setInscripcion] = useState<Inscripcion>(new Inscripcion());

    const handleChange = (field: keyof Inscripcion, value: string | number) => {
        setInscripcion((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            alumnoNombre: inscripcion.alumnoNombre,
            asignaturaId: inscripcion.asignaturaId,
            grupoId: inscripcion.grupoId,
            fechaInscripcion: inscripcion.fechaInscripcion,
            estado: inscripcion.estado,
        };

        const created = await inscripcionService.createInscripcion(payload);
        if (created) {
            await Swal.fire('Creada', 'La inscripción fue creada con éxito.', 'success');
            navigate('/inscripciones/list');
        } else {
            await Swal.fire('Error', 'No se pudo crear la inscripción.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Inscripción</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Alumno</label>
                    <input
                        value={inscripcion.alumnoNombre}
                        onChange={(e) => handleChange('alumnoNombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Asignatura ID</label>
                    <input
                        type="number"
                        value={inscripcion.asignaturaId ?? ''}
                        onChange={(e) => handleChange('asignaturaId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Grupo ID</label>
                    <input
                        type="number"
                        value={inscripcion.grupoId ?? ''}
                        onChange={(e) => handleChange('grupoId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Fecha de inscripción</label>
                    <input
                        type="date"
                        value={inscripcion.fechaInscripcion}
                        onChange={(e) => handleChange('fechaInscripcion', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Estado</label>
                    <select
                        value={inscripcion.estado}
                        onChange={(e) => handleChange('estado', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    >
                        <option value="solicitada">Solicitada</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/inscripciones/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Inscripción
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateInscripcion;
