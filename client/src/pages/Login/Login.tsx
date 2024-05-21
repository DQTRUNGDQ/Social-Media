import background from '../../images/background.jpg'
import google from '../../images/google.jfif'

export default function Login() {
  return (
    <div className='login-main'>
      <div className='login-container'>
        <div className='background-login'>
          <img src={background} alt='background-login' width='1785px' height='510px' />
        </div>
        <div className='form-login'>
          <form action=''>
            <div className='txt-login txt-align'>Đăng nhập với tài khoản Threads của bạn</div>
            <div className='form-input'>
              <input className='input-styled' type='email' placeholder='Email' />
            </div>
            <div className='form-input'>
              <input className='input-styled' type='password' placeholder='Mật khẩu' />
            </div>
            <div className='mg-b'>
              <div className='login-btn'>
                <div className='login-btn-styled'>Đăng nhập</div>
              </div>
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
                  <span className='register'>Tạo tài khoản</span>
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
    </div>
  )
}
