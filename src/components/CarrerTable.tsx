import { Career } from '../models/Career'

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
    <table>

      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {
          careers.map((career) => (

            <tr key={career.id}>

              <td>{career.name}</td>

              <td>{career.code}</td>

              <td>{career.description}</td>

              <td>
                {
                  career.is_active
                    ? 'Active'
                    : 'Inactive'
                }
              </td>

              <td>

                <button
                  onClick={() => onEdit(career)}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(career.id)}
                >
                  Delete
                </button>

              </td>

            </tr>
          ))
        }

      </tbody>

    </table>
  )
}