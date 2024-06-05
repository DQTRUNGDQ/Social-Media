import React, { useState } from 'react'
import axios from 'axios'

import background from '../../images/background.jpg'
import google from '../../images/google.jfif'
import Register from '../Register'

export default function Login() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loginAttempted, setLoginAttempted] = useState(false) // Thêm trạng thái loginAttempted

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setLoginAttempted(true) // Cập nhật trạng thái khi nhấn nút "Đăng nhập"
    try {
      const res = await axios.post('http://localhost:5000/users/login', { email, password })
      const { access_token, refresh_token } = res.data.result

      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('refreshToken', refresh_token)

      setSuccessMessage('Đăng nhập thành công')
      setErrorMessage('')
    } catch (error) {
      console.error(error)
      setErrorMessage('Mật khẩu hoặc Email nhập vào không chính xác')
      setSuccessMessage('')
    }
  }

  const handleRegisterClick = () => {
    setShowRegisterForm(true)
    setLoginAttempted(false) // Đảm bảo không thay đổi trạng thái khi nhấn "Tạo tài khoản"
  }

  return (
    <div className='login-main'>
      <div className='login-container'>
        <div className='background-login'>
          <img src={background} alt='background-login' width='1785px' height='510px' />
        </div>
        <div className='form-login'>
          <form onSubmit={handleLogin}>
            <div className='txt-login txt-align'>Đăng nhập với tài khoản Threads của bạn</div>
            <div className='form-input'>
              <input
                className='input-styled'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form-input'>
              <input
                className='input-styled'
                type='password'
                placeholder='Mật khẩu'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='mg-b'>
              <button type='submit' className='login-btn'>
                <div className='login-btn-styled'>Đăng nhập</div>
              </button>
            </div>

            {loginAttempted &&
              errorMessage && ( // Hiển thị thông báo lỗi nếu đã cố gắng đăng nhập
                <div
                  className='flex text-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-3 rounded relative'
                  role='alert'
                >
                  <span className='block'>{errorMessage}</span>
                </div>
              )}
            {loginAttempted &&
              successMessage && ( // Hiển thị thông báo thành công nếu đã cố gắng đăng nhập
                <div
                  className='flex text-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-3 rounded relative'
                  role='alert'
                >
                  <span className='block'>{successMessage}</span>
                </div>
              )}

            <div className='txt-align'>
              <span className='forgot-pw'>
                <a href='#'>Quên mật khẩu</a>
              </span>
            </div>
            <div className='other-method'>
              <div className='txt-or'>hoặc</div>
              <hr />
            </div>
            <div className='other-method'>
              <div className='other-login'>
                <div className='content-method'>
                  <button type='button' className='register' onClick={handleRegisterClick}>
                    Tạo tài khoản
                  </button>
                </div>
              </div>
            </div>
            <div className='other-login'>
              <div className='logo-method'>
                <img src={google} alt='Instagram' width='45' height='45' />
              </div>
              <div className='content-method'>
                <span>Tiếp tục với Google</span>
              </div>
              <i className='fa-solid fa-angle-right' style={{ color: 'rgb(153, 153, 153)' }}></i>
            </div>
          </form>
        </div>
      </div>
      {showRegisterForm && <Register onClose={() => setShowRegisterForm(false)} />}
    </div>
  )
}
