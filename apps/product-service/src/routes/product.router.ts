import express, { Router } from 'express'
import { createDiscountCodes, createProduct, deleteDiscountCodes, deleteProduct, deleteProductImage, getAllProducts, getCategories, getDiscountCodes, getShopProducts, restoreProduct, uploadProductImage } from '../controllers/product.controller'
import isAuthenticated from '@packages/middleware/isAuthenticated'

const router : Router = express.Router()

router.get('/get-categories', getCategories)
router.post('/create-discount-code', isAuthenticated, createDiscountCodes)
router.get('/get-discount-codes', isAuthenticated, getDiscountCodes)
router.delete('/delete-discount-code/:id', isAuthenticated, deleteDiscountCodes)
router.post('/upload-product-image', isAuthenticated, uploadProductImage)
router.delete('/delete-product-image', isAuthenticated, deleteProductImage)
router.post('/create-product', isAuthenticated, createProduct)
router.delete('/delete-product/:productId', isAuthenticated, deleteProduct)
router.put('/restore-product/:productId', isAuthenticated, restoreProduct)
router.get('/get-shop-products', isAuthenticated, getShopProducts)
router.get('/get-all-products', getAllProducts)

export default router