import { useState } from 'react'

import {
  CreateCareerDto
} from '../../models/Career'

interface Props {
  initialData?: CreateCareerDto
  loading?: boolean
  onSubmit: (
    data: CreateCareerDto
  ) => Promise<void>
}

export default function CareerForm({
  initialData,
  loading = false,
  onSubmit
}: Props) {

  const [formData, setFormData] =
    useState<CreateCareerDto>({
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || ''
    })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>Name</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Code</label>

        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
      >
        {
          loading
            ? 'Saving...'
            : 'Save'
        }
      </button>

    </form>
  )
}