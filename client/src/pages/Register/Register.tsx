import { useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useForm } from 'react-hook-form'
import { rules } from 'src/utils/rules'

interface FormData {
  name: string
  email: string
  password: string
  confirm_password: string
  day: string
  month: string
  year: string
}

export default function Register({ onClose }) {
  const [day, setDay] = useState<number | ''>('')
  const [month, setMonth] = useState<number | ''>('')
  const [year, setYear] = useState<number | ''>('')

  const currentYear = new Date().getFullYear()
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {})
  console.log('error', errors)
  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='overlay flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <a href='#' className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          Threads
        </a>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-14'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-4 sm:pr-8 sm:pl-8 '>
            <button onClick={onClose} className='close-button'>
              <i className='fas fa-times'></i>
            </button>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              Tạo một tài khoản
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={onSubmit} noValidate>
              <div>
                {/* <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Tên
                </label> */}
                <input
                  type='text'
                  id='name'
                  placeholder='Tên'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('name', rules.name)}
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.name?.message}</div>
              </div>
              <div>
                {/* <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Email của bạn
                </label> */}
                <input
                  type='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Email'
                  {...register('email', rules.email)}
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.email?.message}</div>
              </div>
              <div>
                {/* <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Mật khẩu
                </label> */}
                <input
                  type='password'
                  id='password'
                  placeholder='Mật khẩu'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('password', rules.password)}
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.password?.message}</div>
              </div>
              <div>
                {/* <label
                  htmlFor='confirm-password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Xác nhận mật khẩu
                </label> */}
                <input
                  type='password'
                  id='confirm_password'
                  // placeholder='••••••••'
                  placeholder='Xác nhận mật khẩu'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('confirm_password', rules.confirm_password)}
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.confirm_password?.message}</div>
              </div>

              <h2 className='text-sm font-bold'>Ngày sinh</h2>
              <form className='space-y-4'>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <label htmlFor='day' className='block text-sm font-medium text-gray-700'>
                      Ngày
                    </label>
                    <select
                      id='day'
                      value={day}
                      {...register('day', rules.day)}
                      onChange={(e) => setDay(Number(e.target.value) || '')}
                      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    >
                      <option value=''>Chọn ngày</option>
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.day?.message}</div>
                  </div>

                  <div className='flex-1'>
                    <label htmlFor='month' className='block text-sm font-medium text-gray-700'>
                      Tháng
                    </label>
                    <select
                      id='month'
                      value={month}
                      {...register('month', rules.month)}
                      onChange={(e) => setMonth(Number(e.target.value) || '')}
                      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    >
                      <option value=''>Chọn tháng</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.month?.message}</div>
                  </div>

                  <div className='flex-1'>
                    <label htmlFor='year' className='block text-sm font-medium text-gray-700'>
                      Năm
                    </label>
                    <select
                      id='year'
                      value={year}
                      {...register('year', rules.year)}
                      onChange={(e) => setYear(Number(e.target.value) || '')}
                      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    >
                      <option value=''>Chọn năm</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errors.year?.message}</div>
                  </div>
                </div>
              </form>

              {/* <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='terms'
                    aria-describedby='terms'
                    type='checkbox'
                    className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label htmlFor='terms' className='font-light text-gray-500 dark:text-gray-300'>
                    Tôi chấp nhận với{' '}
                    <a className='font-medium text-primary-600 hover:underline dark:text-primary-500' href='#'>
                      điều khoản sử dụng
                    </a>
                  </label>
                </div>
              </div> */}

              <button
                type='submit'
                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Tạo tài khoản
              </button>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                Bạn đã có tài khoản?{' '}
                <a href='#' className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
                  Đăng nhập ở đây
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
