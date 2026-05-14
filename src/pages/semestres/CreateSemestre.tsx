import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Semestre } from '../../models/Semestre';
import { semestreService } from '../../services/semestreService';

const CreateSemestre: React.FC = () => {
    const navigate = useNavigate();
    const [semestre, setSemestre] = useState<Semestre>(new Semestre());

    const handleChange = (field: keyof Semestre, value: string | number) => {
        setSemestre((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            numero: semestre.numero,
            nombre: semestre.nombre,
            ano: semestre.ano,
            carreraId: semestre.carreraId,
        };

        const created = await semestreService.createSemestre(payload);
        if (created) {
            await Swal.fire('Creado', 'El semestre fue creado con éxito.', 'success');
            navigate('/semestres/list');
        } else {
            await Swal.fire('Error', 'No se pudo crear el semestre.', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Crear Semestre</h2>
            <div className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Número</label>
                    <input
                        type="number"
                        value={semestre.numero}
                        onChange={(e) => handleChange('numero', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                        value={semestre.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Año</label>
                    <input
                        type="number"
                        value={semestre.ano}
                        onChange={(e) => handleChange('ano', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Carrera ID</label>
                    <input
                        type="number"
                        value={semestre.carreraId ?? ''}
                        onChange={(e) => handleChange('carreraId', e.target.value ? Number(e.target.value) : null)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/semestres/list')}
                        className="rounded-md border border-stroke px-4 py-2"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-white"
                    >
                        Guardar Semestre
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSemestre;
