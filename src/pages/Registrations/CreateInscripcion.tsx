import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Inscripcion as Registration } from '../../models/Inscripcion';
import { inscripcionService } from '../../services/inscripcionService';

const CreateRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [registration, setRegistration] = useState<Registration>(new Registration());

    const handleChange = (field: keyof Registration, value: string | number) => {
        setRegistration((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            alumnoNombre: registration.alumnoNombre,
            asignaturaId: registration.asignaturaId,
            grupoId: registration.grupoId,
            fechaInscripcion: registration.fechaInscripcion,
            estado: registration.estado,
        };

        const created = await inscripcionService.createInscripcion(payload);
        if (created) {
            await Swal.fire('Created', 'Registration created successfully.', 'success');
            navigate('/inscripciones/list');
        } else {
            await Swal.fire('Error', 'Could not create registration.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Create Registration</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Student</label>
                    <input
                        value={registration.alumnoNombre}
                        onChange={(e) => handleChange('alumnoNombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Subject ID</label>
                    <input
                        type="number"
                        value={registration.asignaturaId ?? ''}
                        onChange={(e) => handleChange('asignaturaId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Group ID</label>
                    <input
                        type="number"
                        value={registration.grupoId ?? ''}
                        onChange={(e) => handleChange('grupoId', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Registration Date</label>
                    <input
                        type="date"
                        value={registration.fechaInscripcion}
                        onChange={(e) => handleChange('fechaInscripcion', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        value={registration.estado}
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
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Save Registration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateRegistration;
