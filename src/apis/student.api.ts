import { Student, Students } from 'types/student.type'
import http from 'utils/http'

export const getStudents = (page: number, limit: number) => {
  return http.get('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
}
export const addStudent = (student: Omit<Student, 'id'>) => {
  return http.post<Student>('/students', student)
}

export const getStudent = (id: string) => {
  return http.get<Student>(`/students/${id}`)
}
export const updateStudent = (id: string | number, student: Student) => {
  return http.put<Student>(`/students/${id}`, student)
}
export const deleteStudent = (id: string) => {
  return http.delete<{}>(`students/${id}`)
}
