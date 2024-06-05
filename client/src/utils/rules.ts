import type { RegisterOptions } from 'react-hook-form'

type Rules = {
  [key in 'name' | 'email' | 'password' | 'confirm_password' | 'day' | 'month' | 'year']?: RegisterOptions
}

export const rules: Rules = {
  name: {
    required: {
      value: true,
      message: 'Tên là bắt buộc'
    },
    maxLength: {
      value: 50,
      message: 'Độ dài từ 5 - 50 ký tự'
    },
    minLength: {
      value: 1,
      message: 'Độ dài từ 5 - 50 ký tự'
    }
  },
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/m,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc'
    },
    maxLength: {
      value: 15,
      message: 'Độ dài từ 8 - 15 ký tự'
    },
    minLength: {
      value: 8,
      message: 'Độ dài từ 8 - 15 ký tự'
    },
    validate: {
      strongPassword: (value) => {
        const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
        if (!strongRegex.test(value)) {
          return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt'
        }
        return true
      }
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại mật khẩu là bắt buộc'
    },
    maxLength: {
      value: 15,
      message: 'Độ dài từ 8 - 15 ký tự'
    },
    minLength: {
      value: 8,
      message: 'Độ dài từ 8 - 15 ký tự'
    }
  },
  day: {
    required: {
      value: true,
      message: 'Bắt buộc phải chọn ngày'
    }
  },
  month: {
    required: {
      value: true,
      message: 'Bắt buộc phải chọn tháng'
    }
  },
  year: {
    required: {
      value: true,
      message: 'Bắt buộc phải chọn năm'
    }
  }
}
