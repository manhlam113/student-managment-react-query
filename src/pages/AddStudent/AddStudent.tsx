import { useMutation, useQuery } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'apis/student.api'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student } from 'types/student.type'
import { isAxiosError } from 'utils/utils'
type FormState = Omit<Student, 'id'> | Student
const initialFormState: FormState = {
  avatar: '',
  email: '',
  last_name: '',
  btc_address: '',
  country: '',
  first_name: '',
  gender: 'other'
}
type FormError =
  | {
      [key in keyof FormState]: string
    }
  | null
export default function AddStudent() {
  const match = useMatch('/students/add')
  const { id } = useParams()
  const isAddStudent = Boolean(match)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const addStudentMutatuion = useMutation({
    mutationFn: (body: FormState) => {
      return addStudent(body)
    }
  })
  const updateMutationStudent = useMutation({
    mutationFn: (_) => {
      return updateStudent(id as string, formState as Student)
    }
  })
  const errorForm: FormError = useMemo(() => {
    const error = isAddStudent ? addStudentMutatuion.error : updateMutationStudent.error
    if (isAxiosError<{ error: FormError }>(error) && error?.response?.status === 422) {
      return error.response?.data.error
    }
    return null
  }, [addStudentMutatuion.error, updateMutationStudent.error, isAddStudent])
  const handleInputChange = (name: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (addStudentMutatuion.data || addStudentMutatuion.error) {
      addStudentMutatuion.reset()
    }
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddStudent) {
      addStudentMutatuion.mutate(formState, {
        onSuccess: () => {
          setFormState(initialFormState)
          toast.success('Add Student successfully')
        }
      })
    } else {
      updateMutationStudent.mutate(undefined, {
        onSuccess: (data) => {
          setFormState(initialFormState)
          toast.success(`Update student succesfully ${data.data.id}`)
        }
      })
    }
  }
  useQuery({
    queryKey: ['student'],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
    onSuccess: (data) => {
      setFormState(data.data)
    }
  })
  // useEffect(() => {
  //   if (studentQuery.data) {
  //     setFormState(studentQuery.data.data)
  //   }
  // }, [studentQuery, formState])
  return (
    <div>
      <h1 className='text-lg'>{`${isAddStudent ? 'Add' : 'Edit'}student `}</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className={classNames(
              `'peer ' block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0`,
              {
                'border-red-500 text-red-500': errorForm?.email,
                'border-blue-600 text-gray-900': !errorForm?.email
              }
            )}
            placeholder=''
            value={formState.email}
            onChange={handleInputChange('email')}
          />
          {errorForm && (
            <p className='font-medium text-red-500'>
              Lỗi !<span>{errorForm?.email}</span>
            </p>
          )}
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Email address
          </label>
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  checked={formState.gender === 'male'}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600'
                  value='male'
                  onChange={handleInputChange('gender')}
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  checked={formState.gender === 'female'}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                  value='female'
                  onChange={handleInputChange('gender')}
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  checked={formState.gender === 'other'}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                  value='other'
                  onChange={handleInputChange('gender')}
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
            placeholder=''
            required
            value={formState.country}
            onChange={handleInputChange('country')}
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              value={formState.first_name}
              onChange={handleInputChange('first_name')}
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600'
              placeholder=' '
              required
              value={formState.last_name}
              onChange={handleInputChange('last_name')}
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 '
              placeholder=' '
              value={formState.avatar}
              onChange={handleInputChange('avatar')}
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600'
              placeholder=' '
              required
              value={formState.btc_address}
              onChange={handleInputChange('btc_address')}
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto'
        >
          {isAddStudent ? 'Submit' : 'Update'}
        </button>
      </form>
    </div>
  )
}
