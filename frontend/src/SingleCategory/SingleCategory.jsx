import './singlecategory.css';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, MenuItem, FormControl, Select, Typography } from '@mui/material';
import Loading from '../Components/loading/Loading';
import ProductCard from '../Components/Card/Product Card/ProductCard';
import CopyRight from '../Components/CopyRight/CopyRight';
import { getAllProducts } from '../Constants/Constant';
import { Sparkles, Search, Filter, RotateCcw, ArrowRight } from 'lucide-react';

const SingleCategory = () => {
    const { cat } = useParams();
    const navigate = useNavigate();

    const currentCat = cat ? cat.toLowerCase() : 'all';

    const [productData, setProductData] = useState([]);
    const [allFetchedProducts, setAllFetchedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSubCat, setSelectedSubCat] = useState('all');
    const [sortOption, setSortOption] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
        window.scroll(0, 0);
    }, [cat]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            if (currentCat !== 'all' && process.env.REACT_APP_PRODUCT_TYPE) {
                const { data } = await axios.post(`${process.env.REACT_APP_PRODUCT_TYPE}`, { userType: currentCat });
                setProductData(data || []);
                setAllFetchedProducts(data || []);
            } else {
                getAllProducts((data) => {
                    setProductData(data || []);
                    setAllFetchedProducts(data || []);
                });
            }
        } catch (error) {
            console.log("Error fetching category products:", error);
            // Fallback to fetch all
            getAllProducts((data) => {
                setProductData(data || []);
                setAllFetchedProducts(data || []);
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Subcategory Audience Pills depending on active main category
    const subCategories = currentCat === 'watches'
        ? [
            { label: "All Watches", value: "all" },
            { label: "Men's Watches", value: "men" },
            { label: "Women's Watches", value: "women" },
            { label: "Kids' Watches", value: "kids" },
        ]
        : currentCat === 'perfumes'
        ? [
            { label: "All Perfumes", value: "all" },
            { label: "Men's Perfumes", value: "men" },
            { label: "Women's Perfumes", value: "women" },
        ]
        : [
            { label: "All Items", value: "all" },
            { label: "Men's Line", value: "men" },
            { label: "Women's Line", value: "women" },
            { label: "Kids' Line", value: "kids" },
        ];

    // Filter & Sort Logic
    let displayedProducts = [...productData];

    // 1. Subcategory / Audience filter
    if (selectedSubCat !== 'all') {
        displayedProducts = displayedProducts.filter(p =>
            (p.gender && p.gender.toLowerCase().includes(selectedSubCat)) ||
            (p.category && p.category.toLowerCase().includes(selectedSubCat)) ||
            (p.name && p.name.toLowerCase().includes(selectedSubCat)) ||
            (p.description && p.description.toLowerCase().includes(selectedSubCat))
        );
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        displayedProducts = displayedProducts.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.type && p.type.toLowerCase().includes(q))
        );
    }

    // 3. Sorting
    if (sortOption === 'lowToHigh') {
        displayedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'highToLow') {
        displayedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'rating') {
        displayedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const handleMainCategoryChange = (newCat) => {
        setSelectedSubCat('all');
        setSearchQuery('');
        if (newCat === 'all') {
            navigate('/products');
        } else {
            navigate(`/product/type/${newCat}`);
        }
    };

    return (
        <div className="products-page-wrapper">
            <Container maxWidth="xl" style={{ marginTop: 20 }}>
                {/* Hero Header Banner */}
                <div className="products-hero-banner">
                    <div className="products-hero-tag">
                        <Sparkles size={14} />
                        <span>JJ Fashion Hub Catalog</span>
                    </div>
                    <h1 className="products-hero-title">
                        {currentCat === 'watches' ? "Luxury Watches Collection" :
                         currentCat === 'perfumes' ? "Signature Perfumes Collection" :
                         "Explore All Collections"}
                    </h1>
                    <p className="products-hero-subtitle">
                        Switch seamlessly between watches, perfumes, and audience styles without leaving this page.
                    </p>
                </div>

                {/* Main Category Switcher Tabs */}
                <div className="category-switcher-tabs">
                    <button
                        className={`cat-tab-btn ${currentCat === 'all' ? 'active' : ''}`}
                        onClick={() => handleMainCategoryChange('all')}
                    >
                        <span>✨ All Collections</span>
                    </button>
                    <button
                        className={`cat-tab-btn ${currentCat === 'watches' ? 'active' : ''}`}
                        onClick={() => handleMainCategoryChange('watches')}
                    >
                        <span>⌚ Luxury Watches</span>
                    </button>
                    <button
                        className={`cat-tab-btn ${currentCat === 'perfumes' ? 'active' : ''}`}
                        onClick={() => handleMainCategoryChange('perfumes')}
                    >
                        <span>🌸 Signature Perfumes</span>
                    </button>
                </div>

                {/* Sub-category Audience Filter Pills */}
                <div className="subcat-pills-row">
                    {subCategories.map(sub => (
                        <button
                            key={sub.value}
                            className={`subcat-pill ${selectedSubCat === sub.value ? 'active' : ''}`}
                            onClick={() => setSelectedSubCat(sub.value)}
                        >
                            {sub.label}
                        </button>
                    ))}
                </div>

                {/* Toolbar (Search & Sort) */}
                <div className="products-toolbar">
                    <div className="results-count-text">
                        Showing <strong>{displayedProducts.length}</strong> items in{" "}
                        <strong>{currentCat === 'all' ? 'All Collections' : currentCat}</strong>
                    </div>

                    <div className="toolbar-controls">
                        {/* Search Input */}
                        <div className="products-search-box">
                            <Search size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="products-search-input"
                            />
                        </div>

                        {/* Sort Select */}
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <Select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: '999px', fontSize: '0.88rem', background: '#f8fafc' }}
                            >
                                <MenuItem value="featured">Sort by: Featured</MenuItem>
                                <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                                <MenuItem value="highToLow">Price: High to Low</MenuItem>
                                <MenuItem value="rating">Highest Rated</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Loading Grid */}
                {isLoading ? (
                    <Container maxWidth="xl" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", padding: 20 }}>
                        <Loading /><Loading /><Loading /><Loading />
                    </Container>
                ) : displayedProducts.length === 0 ? (
                    /* Empty State Card */
                    <div className="products-empty-card">
                        <div className="empty-icon">🛍️</div>
                        <h3 className="empty-title">No Products Found</h3>
                        <p className="empty-subtitle">
                            We couldn't find any products matching your active filters in this category.
                        </p>
                        <button
                            className="btn-primary-glow"
                            onClick={() => { setSelectedSubCat('all'); setSearchQuery(''); setSortOption('featured'); }}
                        >
                            <RotateCcw size={16} /> Reset Filters
                        </button>
                    </div>
                ) : (
                    /* Products Grid */
                    <Container maxWidth="xl" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 20, paddingBottom: 40, width: '100%' }}>
                        {displayedProducts.map(prod => (
                            <Link to={`/Detail/type/${prod.type || currentCat}/${prod._id}`} key={prod._id} style={{ textDecoration: 'none' }}>
                                <ProductCard prod={prod} />
                            </Link>
                        ))}
                    </Container>
                )}
            </Container>

            <CopyRight />
        </div>
    );
};

export default SingleCategory;