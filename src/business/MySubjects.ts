import { Enrollment } from '../models/Enrollment'
import { Group } from '../models/Group'
import { Semester } from '../models/Semester'
import { Subject } from '../models/Subject'

export interface ActiveSemesterSubject {
  enrollmentId: number;
  groupId: number;
  groupName: string;
  groupCode: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  credits: number;
  semesterId: number;
  semesterName: string;
  teacherId: number;
}

function parseToNumber(value: string | number | undefined): number {
  const parsedNumber = Number(value)
  return Number.isNaN(parsedNumber) ? 0 : parsedNumber
}

function getActiveSemester(
  semesters: Semester[]
): Semester | undefined {
  return semesters.find(
    (semester) => semester.is_active === true
  )
}

export function getActiveSemesterSubjects(
  semesters: Semester[],
  enrollments: Enrollment[],
  groups: Group[],
  subjects: Subject[]
): ActiveSemesterSubject[] {
  const activeSemester = getActiveSemester(semesters)

  if (!activeSemester) {
    return []
  }

  const activeSemesterGroups = groups.filter(
    (group) => group.semester_id === activeSemester.id
  )

  const results: ActiveSemesterSubject[] = []

  for (const enrollment of enrollments) {
    const group = activeSemesterGroups.find(
      (currentGroup) => currentGroup.id === enrollment.group_id
    )

    if (!group) {
      continue
    }

    const subject = subjects.find(
      (currentSubject) => currentSubject.id === group.subject_id
    )

    if (!subject) {
      continue
    }

    results.push({
      enrollmentId: parseToNumber(enrollment.id),
      groupId: parseToNumber(group.id),
      groupName: group.name,
      groupCode: group.group_code,
      subjectId: parseToNumber(subject.id),
      subjectName: subject.name,
      subjectCode: subject.code,
      credits: subject.credits,
      semesterId: parseToNumber(activeSemester.id),
      semesterName: activeSemester.name,
      teacherId: parseToNumber(group.teacher_id)
    })
  }

  return results
}

export function formatCredits(
  credits: number
): string {
  return `${credits} credit${credits === 1 ? '' : 's'}`
}