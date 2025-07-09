
import express, { Router } from 'express'
import { loginUser, resetUserPassword, userForgotPassword, userRegistration, verifyUser, verifyUserForgotPassword } from '../controllers/auth.controller'

const router:Router = express.Router()

router.post('/user-registration', userRegistration)
router.post('/verify-user', verifyUser)
router.post('/login-user', loginUser)
router.post('/forgot-user-password', userForgotPassword)
router.post('/reset-user-password', resetUserPassword)
router.post('/verify-forgot-user-password', verifyUserForgotPassword)

export default router