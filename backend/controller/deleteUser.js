const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");

const deleteAllUserData = async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId);
    if (findUser) {
        if (findUser.isAdmin || findUser.email === 'admin@eshopit.com' || findUser.email === 'admin') {
            return res.status(403).send("Super Admin account cannot be deleted.");
        }
        try {
            await User.findByIdAndDelete(userId);
            await Cart.deleteMany({ user: userId });
            await Wishlist.deleteMany({ user: userId });
            await Review.deleteMany({ user: userId });
            return res.send("delete successfully");
        } catch (error) {
            return res.status(500).send("Something went wrong");
        }
    } else {
        return res.status(404).send("User Not Found");
    }
};

module.exports = { deleteAllUserData };