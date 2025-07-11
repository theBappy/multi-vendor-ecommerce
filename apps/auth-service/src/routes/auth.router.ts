
import express, { Router } from 'express'
import { createShop, getUser, loginUser, refreshToken, registerSeller, resetUserPassword, userForgotPassword, userRegistration, verifySeller, verifyUser, verifyUserForgotPassword } from '../controllers/auth.controller'
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
router.post('/seller-registration', registerSeller)
router.post('/verify-seller', verifySeller)
router.post('/create-shop', createShop)

export default router