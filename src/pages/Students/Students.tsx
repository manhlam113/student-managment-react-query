import { deleteStudent, getStudent, getStudents } from 'apis/student.api'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Student, Students as StudentsType } from 'types/student.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/utils'
import { toast } from 'react-toastify'
const initialStateStudent = [
  {
    id: '',
    avatar: '',
    last_name: '',
    email: ''
  }
]

const PAGE_DEFAULT = 1
export default function Students() {
  const queryClient = useQueryClient()
  //=======Cach 1 goi api theo useEffect va axios
  // const [students, setStudents] = useState<StudentsType[]>(initialStateStudent)
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])
  //=====CACH 2 GOI THEO USEQUEY ====
  const queryString = useQueryString()
  const page = Number(queryString.page) || PAGE_DEFAULT
  const { data: students, isLoading } = useQuery({
    queryKey: ['students', page],
    queryFn: () => getStudents(page, 10),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  const totalStudent = Number(students?.headers['x-total-count'])
  const totalPage = Math.ceil(totalStudent / 10)
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => {
      return deleteStudent(id as string)
    }
  })
  const handleDeleteStudent = (id: number | string) => {
    deleteStudentMutation.mutate(id as string, {
      onSuccess: () => {
        toast.success(`Xoa thanh cong student co id: ${id}`)
        queryClient.invalidateQueries({ queryKey: ['students', page] })
      }
    })
  }
  const handlePrefetchData = (id: string) => {
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(String(id))
    })
  }
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-6'>
        <Link
          to={'/students/add'}
          className='mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Add Student
        </Link>
      </div>
      {isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students?.data.map((student: StudentsType) => (
                  <tr
                    onMouseEnter={() => handlePrefetchData(String(student.id))}
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className='font-medium text-red-600 dark:text-red-500'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                {page === 1 ? (
                  <li>
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  </li>
                ) : (
                  <li>
                    <Link to={`/students/?page=${page - 1}`}>
                      <span className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                        Previous
                      </span>
                    </Link>
                  </li>
                )}
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <li key={pageNumber}>
                        <Link
                          to={`/students/?page=${pageNumber}`}
                          className='border border-gray-300 bg-white bg-white py-2 px-3 leading-tight text-gray-500 text-gray-500  hover:bg-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:text-gray-700'
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}
                {page < 10 ? (
                  <>
                    <li>
                      <Link
                        to={`/students/?page=${page + 1}`}
                        className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      >
                        Next
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
