import { Career } from '../../models/Career'

interface Props {
  careers: Career[]
  onEdit: (career: Career) => void
  onDelete: (id: string) => void
}

export default function CareerTable({
  careers,
  onEdit,
  onDelete
}: Props) {

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descripción</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {
            careers.map((career) => (

              <tr key={career.id} className="border-b hover:bg-gray-50 transition">

                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{career.code}</td>

                <td className="px-6 py-4 text-sm text-gray-900">{career.name}</td>

                <td className="px-6 py-4 text-sm text-gray-600">{career.description || '-'}</td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    career.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {
                      career.is_active
                        ? 'Activo'
                        : 'Inactivo'
                    }
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(career)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete(career.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </td>

              </tr>
            ))
          }

        </tbody>

      </table>
    </div>
  )
}