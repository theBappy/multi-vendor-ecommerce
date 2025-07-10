
import express, { Router } from 'express'
import { getUser, loginUser, refreshToken, resetUserPassword, userForgotPassword, userRegistration, verifyUser, verifyUserForgotPassword } from '../controllers/auth.controller'
import isAuthenticated from '@packages/middleware/isAuthenticated'

const router:Router = express.Router()

router.post('/user-registration', userRegistration)
router.post('/verify-user', verifyUser)
router.post('/login-user', loginUser)
router.post('/refresh-user-token', refreshToken)
router.get('/logged-in-user', isAuthenticated, getUser)
router.post('/forgot-user-password', userForgotPassword)
router.post('/reset-user-password', resetUserPassword)
router.post('/verify-forgot-user-password', verifyUserForgotPassword)

export default router