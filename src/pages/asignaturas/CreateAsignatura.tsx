import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Asignatura as Subject } from '../../models/Asignatura';
import { asignaturaService } from '../../services/subjectService';

const CreateSubject: React.FC = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject>(new Subject());

    const handleChange = (field: keyof Subject, value: string | number | boolean) => {
        setSubject((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            nombre: subject.nombre,
            codigo: subject.codigo,
            creditos: subject.creditos,
            semestreId: subject.semestreId,
            carreraId: subject.carreraId,
            optativa: subject.optativa,
        };

        const created = await asignaturaService.createAsignatura(payload);
        if (created) {
            await Swal.fire('Created', 'Subject created successfully.', 'success');
            navigate('/asignaturas/list');
        } else {
            await Swal.fire('Error', 'Could not create subject.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Create Subject</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        value={subject.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Code</label>
                    <input
                        value={subject.codigo}
                        onChange={(e) => handleChange('codigo', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Credits</label>
                    <input
                        type="number"
                        value={subject.creditos}
                        onChange={(e) => handleChange('creditos', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Semester ID</label>
                    <input
                        type="number"
                        value={subject.semestreId ?? ''}
                        onChange={(e) => handleChange('semestreId', e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Career ID</label>
                    <input
                        type="number"
                        value={subject.carreraId ?? ''}
                        onChange={(e) => handleChange('carreraId', e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <input
                        id="optativa"
                        type="checkbox"
                        checked={subject.optativa}
                        onChange={(e) => handleChange('optativa', e.target.checked)}
                    />
                    <label htmlFor="optativa" className="text-sm">Optional</label>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/asignaturas/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Save Subject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSubject;
