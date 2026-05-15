import { DragEvent, useState } from 'react';
import { RubricCriterio } from '../../types/rubrica';

interface RubricaCriteriosTableProps {
  criterios: RubricCriterio[];
  onUpdate: (id: string, field: keyof RubricCriterio, value: string | number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const RubricaCriteriosTable = ({ criterios, onUpdate, onDelete, onAdd, onMove }: RubricaCriteriosTableProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      return;
    }

    onMove(dragIndex, index);
    setDragIndex(null);
  };

  return (
    <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Criterios de evaluación
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-meta-3 dark:text-meta-2">
            La suma de los pesos debe ser 100 %. Ajusta los criterios para que el total sea válido.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
          >
            Plantillas de rúbricas
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Agregar criterio
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm text-left text-black dark:text-white">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Nombre del criterio</th>
              <th className="px-3 py-3">Descripción</th>
              <th className="px-3 py-3">Peso (%)</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {criterios.map((criterio, index) => (
              <tr
                key={criterio.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className="border-b border-stroke transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
              >
                <td className="px-3 py-4 align-top">
                  <div className="flex items-center gap-2 text-meta-3 dark:text-meta-2">
                    <span className="cursor-grab text-xl">⠿</span>
                    <span>{index + 1}</span>
                  </div>
                </td>

                <td className="px-3 py-4 align-top">
                  <input
                    id={`criterio-nombre-${criterio.id}`}
                    type="text"
                    value={criterio.name}
                    onChange={(event) => onUpdate(criterio.id, 'name', event.target.value)}
                    className="w-full rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Nombre del criterio"
                  />
                </td>

                <td className="px-3 py-4 align-top">
                  <input
                    type="text"
                    value={criterio.descripcion}
                    onChange={(event) => onUpdate(criterio.id, 'description', event.target.value)}
                    className="w-full rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Descripción breve"
                  />
                </td>

                <td className="px-3 py-4 align-top">
                  <input
                    type="number"
                    value={criterio.weight}
                    min={0}
                    max={100}
                    step={0.1}
                    onChange={(event) => onUpdate(criterio.id, 'weight', event.target.valueAsNumber || 0)}
                    className="w-24 rounded-md border border-stroke bg-gray px-3 py-2 text-sm text-black transition focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </td>

                <td className="px-3 py-4 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById(`criterio-nombre-${criterio.id}`)?.focus()}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stroke bg-white text-black transition hover:bg-gray dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                      aria-label="Editar criterio"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(criterio.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stroke bg-white text-black transition hover:bg-red-100 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                      aria-label="Eliminar criterio"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RubricaCriteriosTable;
