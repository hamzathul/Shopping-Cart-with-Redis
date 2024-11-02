import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/create-checkout-session', protectRoute, async(req, res)=>{
    try {
        const {products, couponCode} = req.body

        if(!Array.isArray(products) || products.length===0){
            return res.status(400).json({error:"Invalid or empty products array"})
        }

        let totalAmout =0;
        
    } catch (error) {
        
    }
})


export default router