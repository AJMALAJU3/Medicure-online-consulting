import { ISignInResponse } from "../types/authType"
import { api } from "../utils/axiosInstance"

export const signUpApi = async (name: string, email: string, mobile: string, password: string, role: string) => {
    return await api.post('/api/auth/signup', {
        name,
        email,
        mobile,
        password,
        role
    })
}

export const signInApi = async (email: string, password: string, role: string): Promise<ISignInResponse> => {
    return await api.post('/api/auth/signin', {
        email,
        password,
        role
    })
}

export const sendOTPApi = async (email: string) => {
    return await api.post('/api/auth/send-otp', { email })
}

export const changePasswordApi = async (email: string,password: string,role: string) => {
    return api.post('/api/auth/change-password', {
        email,password,role
      })
}

export const verifyOtpApi = async (otp: string, email: string) => {
    return api.post('/api/auth/verify-otp', {
        otp, email
      })
}

export const verifyOtpAndRegisterApi = async (otp: string, email: string) => {
    return api.post('/api/auth/verify-otp-register', {
        otp, email
      })
}