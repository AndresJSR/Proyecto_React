import React from 'react'

import {
  CreateSubjectDto,
  UpdateSubjectDto
} from '../../models/Subject'

interface Props {
  formData: CreateSubjectDto | UpdateSubjectDto

  onChange: (
    field: string,
    value: string | number | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const SubjectForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Name
        </label>

        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Code
        </label>

        <input
          type="text"
          value={formData.code || ''}
          onChange={(e) =>
            onChange('code', e.target.value)
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={formData.description || ''}
          onChange={(e) =>
            onChange('description', e.target.value)
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Credits
        </label>

        <input
          type="number"
          value={formData.credits || 0}
          onChange={(e) =>
            onChange(
              'credits',
              Number(e.target.value)
            )
          }
          className="w-full rounded-md border p-2"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        {loading ? 'Saving...' : 'Save Subject'}
      </button>
    </div>
  )
}

export default SubjectForm