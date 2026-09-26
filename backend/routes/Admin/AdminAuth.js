const express = require('express');
const jwt = require("jsonwebtoken");
const User = require('../../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const authAdmin = require("../../middleware/authAdmin");
const dotenv = require('dotenv');
const { getAllUsersInfo, getSingleUserInfo, getUserCart, getUserWishlist, getUserReview, deleteUserReview, deleteUserCartItem, deleteUserWishlistItem, updateProductDetails, userPaymentDetails, addProduct, deleteProduct } = require('../../controller/AdminControl');
const { chartData } = require('../../controller/AllProductInfo');
dotenv.config();

// Ensure single Super Admin exists on startup / login
const ensureSingleAdminExists = async () => {
    try {
        const adminEmail = "admin";
        const adminEmailFull = "admin@eshopit.com";
        
        let adminUser = await User.findOne({ $or: [{ email: adminEmail }, { email: adminEmailFull }] });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("mi@n2026", salt);

        if (!adminUser) {
            await User.create({
                firstName: "Admin",
                lastName: "User",
                email: adminEmailFull,
                phoneNumber: "0000000000",
                password: hashedPassword,
                isAdmin: true
            });
            console.log("Single Super Admin created (admin@eshopit.com / mi@n2026)");
        } else {
            // Guarantee admin rights and update password if needed
            adminUser.isAdmin = true;
            adminUser.password = hashedPassword;
            await adminUser.save();
        }
    } catch (err) {
        console.log("Error ensuring super admin exists:", err);
    }
};

// Initialize admin on server load
ensureSingleAdminExists();

router.get('/getallusers', authAdmin, getAllUsersInfo);
router.get('/getusers', authAdmin, getAllUsersInfo);
router.get('/getuser/:userId', authAdmin, getSingleUserInfo);
router.get('/geteuser/:userId', authAdmin, getSingleUserInfo);
router.get('/getcart/:userId', authAdmin, getUserCart);
router.get('/getwishlist/:userId', authAdmin, getUserWishlist);
router.get('/getreview/:userId', authAdmin, getUserReview);
router.get('/getorder/:id', authAdmin, userPaymentDetails);
router.get('/getchartdata', chartData);
router.get('/chartdata', chartData);

// Single Super Admin Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Please provide both username/email and password" });
        }

        const inputIdentifier = email.trim().toLowerCase();

        // Check if credentials match the single super admin setup
        const isSuperAdminCreds = (inputIdentifier === "admin" || inputIdentifier === "admin@eshopit.com") && password === "mi@n2026";

        let user = await User.findOne({ $or: [{ email: inputIdentifier }, { email: "admin@eshopit.com" }, { email: "admin" }] });

        if (isSuperAdminCreds || (user && user.isAdmin)) {
            if (!user) {
                await ensureSingleAdminExists();
                user = await User.findOne({ email: "admin@eshopit.com" });
            }

            const passComp = password === "mi@n2026" ? true : await bcrypt.compare(password, user.password);
            
            if (!passComp) {
                return res.status(400).json({ success: false, error: "Invalid Credentials" });
            }

            const data = { user: { id: user._id } };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            return res.json({ success: true, authToken });
        } else {
            return res.status(400).json({ success: false, error: "Invalid Admin Credentials" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// Disable public Admin registration completely
router.post('/register', async (req, res) => {
    return res.status(403).json({
        success: false,
        error: "Admin registration is disabled. Only the single super admin account is allowed."
    });
});

router.post('/addproduct', authAdmin, addProduct);
router.put('/updateproduct/:id', authAdmin, updateProductDetails);
router.delete('/review/:id', authAdmin, deleteUserReview);
router.delete('/usercart/:id', authAdmin, deleteUserCartItem);
router.delete('/userwishlist/:id', authAdmin, deleteUserWishlistItem);
router.delete('/deleteproduct/:id', authAdmin, deleteProduct);

module.exports = router;