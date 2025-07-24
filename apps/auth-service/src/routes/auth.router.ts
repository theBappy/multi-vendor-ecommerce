
import express, { Router } from 'express'
import { createShop, createStripeConnectLink, getSeller, getUser, loginSeller, loginUser, refreshToken, registerSeller, resetUserPassword, userForgotPassword, userRegistration, verifySeller, verifyUser, verifyUserForgotPassword } from '../controllers/auth.controller'
import isAuthenticated from '@packages/middleware/isAuthenticated'
import { isSeller } from '@packages/middleware/authorizeRoles'
import { addUserAddress, deleteUserAddress, getUserAddress } from '../controllers/user.controller'

const router:Router = express.Router()

router.post('/user-registration', userRegistration)
router.post('/verify-user', verifyUser)
router.post('/login-user', loginUser)
router.post('/refresh-token', refreshToken)
router.get('/logged-in-user', isAuthenticated, getUser)
router.post('/forgot-user-password', userForgotPassword)
router.post('/reset-user-password', resetUserPassword)
router.post('/verify-forgot-user-password', verifyUserForgotPassword)
router.post('/seller-registration', registerSeller)
router.post('/verify-seller', verifySeller)
router.post('/create-shop', createShop)
router.post('/create-stripe-link', createStripeConnectLink)
router.post('/login-seller', loginSeller)
router.get('/logged-in-seller', isAuthenticated, isSeller, getSeller)

// user-related routes
router.get('/shipping-address', isAuthenticated, getUserAddress)
router.post('/add-address', isAuthenticated, addUserAddress)
router.delete('/delete-address/:addressId', isAuthenticated, deleteUserAddress)

export default router