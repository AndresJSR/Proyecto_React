import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Carrera } from '../../models/Career';
import { carreraService } from '../../services/careerService';

const CreateCarrera: React.FC = () => {
    const navigate = useNavigate();
    const [carrera, setCarrera] = useState<Carrera>(new Carrera());

    const handleChange = (field: keyof Carrera, value: string | number) => {
        setCarrera((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            nombre: carrera.nombre,
            codigo: carrera.codigo,
            descripcion: carrera.descripcion,
            creditosTotales: carrera.creditosTotales,
        };

        const created = await carreraService.createCarrera(payload);
        if (created) {
            await Swal.fire('Creado', 'La carrera fue creada con éxito.', 'success');
            navigate('/carreras/list');
        } else {
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
                        value={carrera.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Código</label>
                    <input
                        value={carrera.codigo}
                        onChange={(e) => handleChange('codigo', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <input
                        value={carrera.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Créditos totales</label>
                    <input
                        type="number"
                        value={carrera.creditosTotales}
                        onChange={(e) => handleChange('creditosTotales', Number(e.target.value))}
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

export default CreateCarrera;
