import CareerForm from './CareerForm'

import {
    CreateCareerDto
} from '../models/Career'

interface Props {
  open: boolean
  loading?: boolean
  initialData?: CreateCareerDto
  onClose: () => void
  onSubmit: (
    data: CreateCareerDto
  ) => Promise<void>
}

export default function CareerModal({
  open,
  loading,
  initialData,
  onClose,
  onSubmit
}: Props) {

  if (!open) {
    return null
  }

  return (
    <div>

      <div>

        <h2>
          Career Form
        </h2>

        <CareerForm
          initialData={initialData}
          loading={loading}
          onSubmit={onSubmit}
        />

        <button onClick={onClose}>
          Close
        </button>

      </div>

    </div>
  )
}