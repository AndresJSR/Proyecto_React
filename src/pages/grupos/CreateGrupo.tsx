import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Grupo } from '../../models/Grupo';
import { grupoService } from '../../services/grupoService';

const CreateGrupo: React.FC = () => {
    const navigate = useNavigate();
    const [grupo, setGrupo] = useState<Grupo>(new Grupo());

    const handleChange = (field: keyof Grupo, value: string | number) => {
        setGrupo((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            nombre: grupo.nombre,
            asignaturaId: grupo.asignaturaId,
            semestreId: grupo.semestreId,
            profesor: grupo.profesor,
            horario: grupo.horario,
            capacidad: grupo.capacidad,
        };

        const created = await grupoService.createGrupo(payload);
        if (created) {
            await Swal.fire('Creado', 'El grupo fue creado con éxito.', 'success');
            navigate('/grupos/list');
        } else {
            await Swal.fire('Error', 'No se pudo crear el grupo.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Grupo</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                        value={grupo.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Asignatura ID</label>
                    <input
                        type="number"
                        value={grupo.asignaturaId ?? ''}
                        onChange={(e) => handleChange('asignaturaId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Semestre ID</label>
                    <input
                        type="number"
                        value={grupo.semestreId ?? ''}
                        onChange={(e) => handleChange('semestreId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Profesor</label>
                    <input
                        value={grupo.profesor}
                        onChange={(e) => handleChange('profesor', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Horario</label>
                    <input
                        value={grupo.horario}
                        onChange={(e) => handleChange('horario', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Capacidad</label>
                    <input
                        type="number"
                        value={grupo.capacidad}
                        onChange={(e) => handleChange('capacidad', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/grupos/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Grupo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGrupo;
