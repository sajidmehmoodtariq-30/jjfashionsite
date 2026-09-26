const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
let success = false;
const getAllUsersInfo = async (req, res) => {
    try {
        const data = await User.find().select('-password');
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
}
const getSingleUserInfo = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUser = await User.findById(userId).select('-password');
            res.send(findUser);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserCart = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUserCart = await Cart.find({ user: userId })
                .populate("productId", "name price image rating type")
                .populate("user", "name email");
            res.send(findUserCart);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserWishlist = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {
            const findUserWishlist = await Wishlist.find({ user: userId }).populate("productId")
            res.send(findUserWishlist);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}
const getUserReview = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId)
    if (findUser) {
        try {

            const findUserReview = await Review.find({ user: userId })
                .populate("productId", "name price image rating type")
                .populate("user", "firstName lastName");
            res.send(findUserReview);
        } catch (error) {
            res.send("Something went wrong")
        }
    }
    else {
        res.status(400).send("User Not Found")
    }

}

const deleteUserReview = async (req, res) => {
    const { id } = req.params;
    try {
        let deleteReview = await Review.findByIdAndDelete(id)
        res.send({ msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter", error })
    }
}


const deleteUserCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        let deleteCart = await Cart.findByIdAndDelete(id)
        success = true
        res.send({ success, msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter1" })
    }
}
const deleteUserWishlistItem = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        let deleteCart = await Wishlist.findByIdAndDelete(id)
        success = true
        res.send({ success, msg: "Review deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Something went wrong,Please try again letter" })
    }
}


const updateProductDetails = async (req, res) => {
    try {
        const updateProduct = req.body.productDetails || req.body;
        if (!updateProduct) {
            return res.status(400).json({ success: false, error: "No product data provided" });
        }
        if (updateProduct.price !== undefined) updateProduct.price = parseFloat(updateProduct.price) || 0;
        if (updateProduct.rating !== undefined) updateProduct.rating = parseFloat(updateProduct.rating) || 0;
        if (!updateProduct.type && updateProduct.category) {
            updateProduct.type = updateProduct.category.toLowerCase();
        }
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            const updated = await Product.findByIdAndUpdate(id, { $set: updateProduct }, { new: true });
            return res.json({ success: true, msg: "Product updated successfully", product: updated });
        } else {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
    } catch (error) {
        console.log("Error updating product:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to update product" });
    }
};

const userPaymentDetails = async (req, res) => {
    const { id } = req.params;
    const findPayment = await Payment.find({ user: id })    
    if (findPayment) {
        try {
            res.send(findPayment)
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    else {
        return res.status(400).send({ total: 0 })
    }
}

const addProduct = async (req, res) => {
    let { name, brand, price, category, image, rating, type, author, description, gender } = req.body;
    try {
        price = parseFloat(price) || 0;
        rating = parseFloat(rating) || 4.5;
        if (!type) {
            type = category ? category.toLowerCase() : 'watches';
        }
        const newProduct = await Product.create({ name, brand, price, category, image, rating, type, author, description, gender });
        return res.json({ success: true, product: newProduct });
    } catch (error) {
        console.log("Error adding product:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to add product" });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        let findProduct = await Product.findByIdAndDelete(id);
        if (findProduct) {
            return res.json({ success: true, msg: "Product deleted successfully" });
        } else {
            return res.status(404).json({ success: false, msg: "Product Not Found" });
        }
    } catch (error) {
        console.log("Error deleting product:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllUsersInfo, getSingleUserInfo,
    getUserCart, getUserWishlist,
    getUserReview, deleteUserReview,
    deleteUserCartItem, deleteUserWishlistItem,
    updateProductDetails, userPaymentDetails, addProduct, deleteProduct
}