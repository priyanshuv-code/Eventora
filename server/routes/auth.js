const express = require('express');
const router = express.Router();

const { 
    register, 
    login, 
    verifyOTP, 
    resendOTP, 
    changePassword, 
    changeEmail 
} = require('../controllers/authController');

// Yahan humne { protect } use kiya hai kyunki middleware file mein wahi naam se export hai
const { protect } = require('../middleware/auth'); 

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Yahan authMiddleware ki jagah protect pass kar diya
router.put('/admin/change-password', protect, changePassword);
router.put('/admin/change-email', protect, changeEmail);

module.exports = router;