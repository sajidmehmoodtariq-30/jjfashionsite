import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Box } from '@mui/material';
import { ContextFunction } from '../../Context/Context';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import BannerData from '../../Helpers/HomePageBanner';
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';
import CopyRight from '../../Components/CopyRight/CopyRight';
import { getAllProducts } from '../../Constants/Constant';
import {
    Truck,
    ShieldCheck,
    Headphones,
    RefreshCw,
    Sparkles,
    Flame,
    Clock,
    Star,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const { setCart } = useContext(ContextFunction);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    let authToken = localStorage.getItem('Authorization');

    useEffect(() => {
        getCart();
        getAllProducts(setAllProducts);
        fetchDynamicCategories();
        window.scroll(0, 0);
    }, []);

    const fetchDynamicCategories = async () => {
        try {
            const url = process.env.REACT_APP_ADMIN_GET_CATEGORY || 'http://localhost:5000/api/category/fetchcategories';
            const { data } = await axios.get(url);
            if (data && Array.isArray(data) && data.length > 0) {
                setCategories(data);
            } else {
                setCategories(BannerData);
            }
        } catch (error) {
            console.log("Error fetching dynamic categories:", error);
            setCategories(BannerData);
        }
    };

    const getCart = async () => {
        if (authToken !== null && process.env.REACT_APP_GET_CART) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                setCart(data);
            } catch (err) {
                console.log("Cart fetch error:", err);
            }
        }
    };

    const activeCategoryList = categories.length > 0 ? categories : BannerData;

    // Filter categories based on user quick-pills selection
    const filteredCategories = activeCategoryList.filter(cat => {
        if (selectedCategory === 'all') return true;
        const catType = (cat.type || cat.filter || '').toLowerCase();
        const catName = (cat.name || cat.subCategory || '').toLowerCase();
        const catAudience = (cat.audience || '').toLowerCase();

        if (selectedCategory === 'men-watches') return (catType === 'watches') && (catName.includes('men') || catAudience === 'men');
        if (selectedCategory === 'women-watches') return (catType === 'watches') && (catName.includes('women') || catAudience === 'women');
        if (selectedCategory === 'kids-watches') return (catType === 'watches') && (catName.includes('kid') || catAudience === 'kids');
        if (selectedCategory === 'men-perfumes') return (catType === 'perfumes') && (catName.includes('men') || catAudience === 'men');
        if (selectedCategory === 'women-perfumes') return (catType === 'perfumes') && (catName.includes('women') || catAudience === 'women');
        return true;
    });

    // Featured Products subset
    const featuredProducts = allProducts.length > 0 ? allProducts.slice(0, 8) : [];

    return (
        <div className="homepage-container">
            <Container maxWidth="xl" style={{ padding: 0 }}>
                {/* 1. Hero Carousel */}
                <Box padding={1}>
                    <Carousel />
                </Box>

                {/* 2. Value Propositions Bar */}
                <div className="value-props-grid">
                    <div className="value-prop-card">
                        <div className="value-icon-box">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h4 className="value-prop-title">Free Express Delivery</h4>
                            <p className="value-prop-desc">Complimentary shipping on all watches & perfumes</p>
                        </div>
                    </div>

                    <div className="value-prop-card">
                        <div className="value-icon-box">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="value-prop-title">100% Authentic Guarantee</h4>
                            <p className="value-prop-desc">Verified genuine luxury timepieces & French perfumes</p>
                        </div>
                    </div>

                    <div className="value-prop-card">
                        <div className="value-icon-box">
                            <Headphones size={24} />
                        </div>
                        <div>
                            <h4 className="value-prop-title">24/7 VIP Support</h4>
                            <p className="value-prop-desc">Dedicated concierge for product inquiries</p>
                        </div>
                    </div>

                    <div className="value-prop-card">
                        <div className="value-icon-box">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h4 className="value-prop-title">30-Day Easy Returns</h4>
                            <p className="value-prop-desc">Hassle-free money back guarantee</p>
                        </div>
                    </div>
                </div>

                {/* 3. Search Bar & Taxonomy Quick Filter Pills */}
                <Container style={{ marginTop: 40, display: "flex", justifyContent: 'center' }}>
                    <SearchBar
                        selectedCategory={selectedCategory}
                        onSelectCategory={(cat) => setSelectedCategory(cat)}
                    />
                </Container>

                {/* 4. Featured Collections Section (Watches & Perfumes Taxonomy) */}
                <div className="section-header-box">
                    <div className="section-tag">
                        <Sparkles size={14} />
                        <span>Featured Collections</span>
                    </div>
                    <h2 className="section-main-title">Watches & Signature Perfumes</h2>
                    <p className="section-subtitle">Discover executive men's watches, elegant women's chronographs, kids timepieces & captivating fragrances.</p>
                </div>

                <div className="categories-grid">
                    {filteredCategories.map((data, idx) => (
                        <CategoryCard data={data} key={data.subCategory + idx} />
                    ))}
                </div>

                {/* 5. Trending Showcase Section */}
                {featuredProducts.length > 0 && (
                    <>
                        <div className="section-header-box" style={{ marginTop: 90 }}>
                            <div className="section-tag" style={{ background: '#fef3c7', color: '#d97706' }}>
                                <Flame size={14} />
                                <span>Trending Now</span>
                            </div>
                            <h2 className="section-main-title">Top Rated Timepieces & Fragrances</h2>
                            <p className="section-subtitle">Handpicked luxury watches and signature fragrances loved by our customers.</p>
                        </div>

                        <div className="products-grid">
                            {featuredProducts.map((prod) => (
                                <ProductCard prod={prod} key={prod._id} />
                            ))}
                        </div>
                    </>
                )}

                {/* 6. High-Conversion Flash Sale Banner */}
                <div className="flash-sale-section">
                    <div className="hero-glow-1"></div>
                    <div className="flash-sale-container">
                        <div className="flash-sale-info">
                            <div className="flash-sale-badge">
                                <Clock size={16} />
                                <span>Exclusive Watch & Scent Sale</span>
                            </div>
                            <h2 className="flash-sale-title">Midnight Flash Deal – Up to 40% Off</h2>
                            <p className="flash-sale-desc">
                                Premium chronographs, rose gold watches, and designer EDP perfumes at special flash prices.
                            </p>

                            <div className="timer-container">
                                <div className="timer-box">
                                    <div className="timer-num">08</div>
                                    <div className="timer-label">Hours</div>
                                </div>
                                <span className="timer-colon">:</span>
                                <div className="timer-box">
                                    <div className="timer-num">42</div>
                                    <div className="timer-label">Mins</div>
                                </div>
                                <span className="timer-colon">:</span>
                                <div className="timer-box">
                                    <div className="timer-num">15</div>
                                    <div className="timer-label">Secs</div>
                                </div>
                            </div>

                            <Link to="/product/type/watches" className="btn-primary-glow">
                                <ShoppingBag size={18} />
                                Shop Flash Sale
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 7. Testimonials & Social Proof */}
                <div className="section-header-box">
                    <div className="section-tag" style={{ background: '#ecfdf5', color: '#059669' }}>
                        <Star size={14} />
                        <span>Customer Experience</span>
                    </div>
                    <h2 className="section-main-title">Loved By Connoisseurs</h2>
                    <p className="section-subtitle">Read why watch enthusiasts and fragrance lovers trust JJ Fashion Hub.</p>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Sarah M." className="testimonial-avatar" />
                            <div>
                                <div className="testimonial-name">Sarah Jenkins</div>
                                <div className="testimonial-role">Verified Buyer • Women's Watch</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, color: '#f59e0b', marginBottom: 10 }}>
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                        </div>
                        <p className="testimonial-text">"The rose gold watch I ordered for my anniversary is breathtaking. Express delivery was fast and the luxury packaging was top notch!"</p>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="David R." className="testimonial-avatar" />
                            <div>
                                <div className="testimonial-name">David Ross</div>
                                <div className="testimonial-role">Verified Buyer • Men's Perfume</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, color: '#f59e0b', marginBottom: 10 }}>
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                        </div>
                        <p className="testimonial-text">"The woody men's perfume scent lasts all day. Highly impressive quality and authentic fragrance notes."</p>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Elena T." className="testimonial-avatar" />
                            <div>
                                <div className="testimonial-name">Elena Thorne</div>
                                <div className="testimonial-role">Verified Buyer • Kids' Watch</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, color: '#f59e0b', marginBottom: 10 }}>
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                            <Star size={16} fill="#f59e0b" />
                        </div>
                        <p className="testimonial-text">"Bought a smart digital watch for my son's birthday. Durable, water-resistant, and he absolutely loves wearing it!"</p>
                    </div>
                </div>
            </Container>

            {/* 8. Footer */}
            <CopyRight />
        </div>
    );
};

export default HomePage;