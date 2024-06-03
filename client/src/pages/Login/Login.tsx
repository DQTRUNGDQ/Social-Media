import React, { useState } from 'react'
import axios from 'axios'

import background from '../../images/background.jpg'
import google from '../../images/google.jfif'
import Register from '../Register'

export default function Login() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/users/login', { email, password })
      const { access_token, refresh_token } = res.data.result

      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('refreshToken', refresh_token)

      alert('Login successful')
    } catch (error) {
      console.error(error)
      alert('Login failed')
    }
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
            <div className='txt-align'>
              <span className='forgot-pw'>
                <a href='s'>Quên mật khẩu</a>
              </span>
            </div>
            <div className='other-method'>
              <div className='txt-or'>hoặc</div>
              <hr />
            </div>
            <div className='other-method'>
              <div className='other-login'>
                <div className='content-method'>
                  <span className='register' onClick={() => setShowRegisterForm(true)}>
                    Tạo tài khoản
                  </span>
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
