import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Matricula } from '../../models/Matricula';
import { matriculaService } from '../../services/matriculaService';

const CreateMatricula: React.FC = () => {
    const navigate = useNavigate();
    const [matricula, setMatricula] = useState<Matricula>(new Matricula());

    const handleChange = (field: keyof Matricula, value: string | number) => {
        setMatricula((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            alumnoNombre: matricula.alumnoNombre,
            carreraId: matricula.carreraId,
            semestreId: matricula.semestreId,
            fechaMatricula: matricula.fechaMatricula,
            estado: matricula.estado,
        };

        const created = await matriculaService.createMatricula(payload);
        if (created) {
            await Swal.fire('Creada', 'La matrícula fue creada con éxito.', 'success');
            navigate('/matriculas/list');
        } else {
            await Swal.fire('Error', 'No se pudo crear la matrícula.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Matrícula</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Alumno</label>
                    <input
                        value={matricula.alumnoNombre}
                        onChange={(e) => handleChange('alumnoNombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Carrera ID</label>
                    <input
                        type="number"
                        value={matricula.carreraId ?? ''}
                        onChange={(e) => handleChange('carreraId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Semestre ID</label>
                    <input
                        type="number"
                        value={matricula.semestreId ?? ''}
                        onChange={(e) => handleChange('semestreId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Fecha de matrícula</label>
                    <input
                        type="date"
                        value={matricula.fechaMatricula}
                        onChange={(e) => handleChange('fechaMatricula', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Estado</label>
                    <select
                        value={matricula.estado}
                        onChange={(e) => handleChange('estado', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/matriculas/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Matrícula
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMatricula;
