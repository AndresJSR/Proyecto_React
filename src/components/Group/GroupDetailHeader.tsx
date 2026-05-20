import { ChevronLeft, BookOpen, CalendarDays, Users, User, Hash, ToggleRight, AlertTriangle } from 'lucide-react'
import { GroupDetailInfo } from '../../business/GroupBusiness'

interface GroupDetailHeaderProps {
  detail: GroupDetailInfo
  teacherName: string
  onBack: () => void
}

const STATUS_BADGE: Record<GroupDetailInfo['statusColor'], string> = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
}

interface InfoCellProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

const InfoCell = ({ icon, label, value }: InfoCellProps) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-1 text-xs text-bodydark2">
      {icon}
      {label}
    </span>
    <span className="text-sm font-medium text-black dark:text-white">{value}</span>
  </div>
)

const GroupDetailHeader = ({ detail, teacherName, onBack }: GroupDetailHeaderProps) => (
  <div className="mb-6 rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">

    {/* Fila superior */}
    <div className="mb-5 flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-bodydark1 hover:text-primary"
      >
        <ChevronLeft size={16} />
        Volver
      </button>

      <h2 className="flex-1 text-xl font-bold text-black dark:text-white leading-tight">
        {detail.name}
      </h2>

      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[detail.statusColor]}`}>
        {detail.statusLabel}
      </span>
    </div>

    {/* Grid de información */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <InfoCell
        icon={<BookOpen size={13} />}
        label="Asignatura"
        value={detail.subjectName}
      />
      <InfoCell
        icon={<CalendarDays size={13} />}
        label="Semestre"
        value={detail.semesterName}
      />
      <InfoCell
        icon={<Users size={13} />}
        label="Estudiantes"
        value={detail.occupancyLabel}
      />
      <InfoCell
        icon={<User size={13} />}
        label="Docente"
        value={teacherName || '—'}
      />
      <InfoCell
        icon={<Hash size={13} />}
        label="Código"
        value={detail.groupCode}
      />
      <InfoCell
        icon={<ToggleRight size={13} />}
        label="Estado"
        value={
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[detail.statusColor]}`}>
            {detail.statusLabel}
          </span>
        }
      />
    </div>

    {/* Banner semestre cerrado */}
    {!detail.isEditable && (
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2.5 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
        <AlertTriangle size={15} className="shrink-0" />
        Este grupo pertenece a un semestre cerrado. Solo lectura.
      </div>
    )}
  </div>
)

export default GroupDetailHeader