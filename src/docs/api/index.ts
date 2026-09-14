import type { ApiEndpoint } from './types.ts'
import { statusEndpoint } from './status.ts'
import { registerEndpoint } from './register.ts'
import { loginEndpoint } from './login.ts'
import { verifyEmailEndpoint } from './verifyEmail.ts'
import { resendOtpEndpoint } from './resendOtp.ts'
import { refreshEndpoint } from './refresh.ts'
import { meEndpoint } from './me.ts'
import { forgotPasswordEndpoint } from './forgotPassword.ts'
import { resetPasswordEndpoint } from './resetPassword.ts'
import { changePasswordEndpoint } from './changePassword.ts'
import { logoutEndpoint } from './logout.ts'

/* Registry of reference-app endpoint pages, in sidebar order. Adding
   an endpoint = one data module + one line here + one nav entry. */

export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
  [statusEndpoint.slug]: statusEndpoint,
  [registerEndpoint.slug]: registerEndpoint,
  [loginEndpoint.slug]: loginEndpoint,
  [verifyEmailEndpoint.slug]: verifyEmailEndpoint,
  [resendOtpEndpoint.slug]: resendOtpEndpoint,
  [refreshEndpoint.slug]: refreshEndpoint,
  [meEndpoint.slug]: meEndpoint,
  [forgotPasswordEndpoint.slug]: forgotPasswordEndpoint,
  [resetPasswordEndpoint.slug]: resetPasswordEndpoint,
  [changePasswordEndpoint.slug]: changePasswordEndpoint,
  [logoutEndpoint.slug]: logoutEndpoint,
}

export const API_ORDER: string[] = [
  statusEndpoint.slug,
  registerEndpoint.slug,
  loginEndpoint.slug,
  verifyEmailEndpoint.slug,
  resendOtpEndpoint.slug,
  refreshEndpoint.slug,
  meEndpoint.slug,
  forgotPasswordEndpoint.slug,
  resetPasswordEndpoint.slug,
  changePasswordEndpoint.slug,
  logoutEndpoint.slug,
]
