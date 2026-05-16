import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CreateCareerDto } from '../../models/Career';
import { careerService } from '../../services/careerService';

const CreateCareer: React.FC = () => {
    const navigate = useNavigate();

    interface FormCareer {
        name: string;
        code: string;
        description: string;
        totalCredits: number;
    }

    const [career, setCareer] = useState<FormCareer>({
        name: '',
        code: '',
        description: '',
        totalCredits: 0
    });

    const handleChange = (field: keyof FormCareer, value: string | number) => {
        setCareer((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload: CreateCareerDto = {
            name: career.name,
            code: career.code,
            description: career.description
        };

        try {
            await careerService.createCareer(payload);
            await Swal.fire('Creado', 'La carrera fue creada con éxito.', 'success');
            navigate('/carreras/list');
        } catch (err) {
            await Swal.fire('Error', 'No se pudo crear la carrera.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Carrera</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                        value={career.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Código</label>
                    <input
                        value={career.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <input
                        value={career.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Créditos totales</label>
                    <input
                        type="number"
                        value={career.totalCredits}
                        onChange={(e) => handleChange('totalCredits', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/carreras/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Carrera
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCareer;
