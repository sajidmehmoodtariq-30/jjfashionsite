const Category = require('../models/Category');

const defaultInitialCategories = [
    {
        name: "Men's Watches",
        type: "watches",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
        description: "Precision Chronographs & Executive Steel Timepieces for Men"
    },
    {
        name: "Women's Watches",
        type: "watches",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
        description: "Elegant Rose Gold & Diamond Accent Timepieces for Women"
    },
    {
        name: "Kids' Watches",
        type: "watches",
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
        description: "Durable, Colorful & Smart Digital Watches for Kids"
    },
    {
        name: "Men's Perfumes",
        type: "perfumes",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
        description: "Bold Woody, Amber & Executive Colognes for Men"
    },
    {
        name: "Women's Perfumes",
        type: "perfumes",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
        description: "Luxurious Floral, Vanilla & Sensual EDP Scents for Women"
    }
];

const getCategories = async (req, res) => {
    try {
        let categories = await Category.find().sort({ createdAt: -1 });
        if (!categories || categories.length === 0) {
            await Category.insertMany(defaultInitialCategories);
            categories = await Category.find().sort({ createdAt: -1 });
            console.log("Auto-seeded initial categories into MongoDB");
        }
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
    }
};

const addCategory = async (req, res) => {
    const { name, type, image, description } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const category = await Category.create({
            name: name.trim(),
            type: type || 'all',
            image: image || '',
            description: description || ''
        });
        res.status(201).json({ success: true, message: "Category created successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating category", error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, type, image, description } = req.body;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: { name, type, image, description } },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating category", error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
};
