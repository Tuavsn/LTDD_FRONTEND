export const strings = {
  orderHistory: {
  },
  editProfile: {
    titles: {
      email: 'Email',
      phone: 'Số điện thoại',
      fullname: 'Họ và tên',
      avatar: 'Ảnh đại diện',
      password: 'Mật khẩu',
      oldPassword: 'Mật khẩu cũ',
      confirmPassword: 'Xác nhận mật khẩu',
    },
    errors: {
      fullInformationRequired: 'Vui lòng nhập đầy đủ thông tin',
      emptyOldPassword: 'Vui lòng nhập mật khẩu cũ',
      emailInvalid: 'Email không hợp lệ',
      phoneInvalid: 'Số điện thoại không hợp lệ',
      passwordNotMatch: 'Mật khẩu không khớp',
      error: 'Đã có lỗi xảy ra',
      passwordLengthInvalid: 'Mật khẩu phải có ít nhất 6 ký tự',
    },
    texts: {
      success: 'Cập nhật thông tin thành công',
      noPermission: 'Xin lỗi, bạn cần cấp quyền truy cập để sử dụng tính năng này',
    }
  },
  confirmNewPassword: {
    labels: {
      title: 'Xác nhận mật khẩu mới',
      newPassword: 'Mật khẩu mới',
      confirmNewPassword: 'Nhập lại mật khẩu mới',
      submit: 'Xác nhận',
    },
    errors: {
      passwordNotMatch: 'Mật khẩu không khớp',
      passwordLengthNotValid: 'Mật khẩu phải có ít nhất 6 ký tự',
      specialCharacterRequired: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
      numberRequired: 'Mật khẩu phải chứa ít nhất 1 số',
      error: 'Đã có lỗi xảy ra',
    },
    texts: {
      cancel: 'Hủy bỏ'
    }
  },
  forgotPassword: {
    labels: {
      title: 'Quên mật khẩu',
      email: 'Email',
      error: 'error',
      submit: 'Gửi'
    },
    errors: {
      emailRequired: 'Vui lòng nhập email',
      error: 'Đã có lỗi xảy ra',
    },
    texts: {
      backToLogin: 'Quay lại trang đăng nhập'
    }
  }
  , otpConfirm: {
    labels: {
      title: 'Xác thực OTP',
      otp: 'OTP',
      error: 'error',
      confirm: 'Xác thực'
    },
    errors: {
      fullInformationRequired: 'Vui lòng nhập đày đủ thông tin',
      error: 'Đã có lỗi xảy ra',
    },
    texts: {
      cancel: 'Hủy',
      resendOTP: 'Không nhận được mã? Gửi lại OTP',
      resendOTPIn: 'Gửi lại OTP trong',
      seconds: 'giây',
      resendOTPSuccess: 'Gửi lại OTP thành công',
      otpSuccess: 'Xác thực OTP thành công',
      otpFail: 'Xác thực OTP thất bại',
    }
  },
  login: {
    labels: {
      title: 'Đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      login: 'Đăng nhập'
    },
    errors: {
      fullInformationRequired: 'Vui lòng nhập đầy đủ thông tin',
      error: 'Đã có lỗi xảy ra',
    },
    texts: {
      navigateRegister: 'Chưa có tài khoản? Đăng ký ngay!',
      navigateForgotPassword: 'Quên mật khẩu?'
    }
  },
  register: {
    labels: {
      title: 'Đăng ký',
      email: 'Email',
      phone: 'Số điện thoại',
      fullname: 'Họ và tên',
      password: 'Mật khẩu',
      confirmPassword: 'Nhập lại mật khẩu',
      error: 'error',
      register: 'Đăng ký'
    },
    errors: {
      fullInformationRequired: 'Vui lòng nhập đầy đủ thông tin',
      emailInvalid: 'Email không hợp lệ',
      phoneInvalid: 'Số điện thoại không hợp lệ',
      passwordNotMatch: 'Mật khẩu không khớp',
      error: 'Đã có lỗi xảy ra',
      passwordLengthInvalid: 'Mật khẩu phải có ít nhất 6 ký tự',
    },
    texts: {
      backToLogin: 'Đã có tài khoản? Đăng nhập ngay!',
      success: 'Đăng ký thành công'
    }
  },
}