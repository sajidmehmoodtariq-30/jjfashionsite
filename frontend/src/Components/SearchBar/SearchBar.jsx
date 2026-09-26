import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { Search, X, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { getAllProducts } from "../../Constants/Constant";
import './SearchBar.css';

const SearchBar = ({ selectedCategory, onSelectCategory }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { label: "All Items", value: "all" },
        { label: "Men's Watches", value: "men-watches" },
        { label: "Women's Watches", value: "women-watches" },
        { label: "Kids' Watches", value: "kids-watches" },
        { label: "Men's Perfumes", value: "men-perfumes" },
        { label: "Women's Perfumes", value: "women-perfumes" },
    ];

    useEffect(() => {
        getAllProducts(setData);
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (!val.trim()) {
            setFilteredData([]);
            return;
        }

        const productList = Array.isArray(data) ? data : [];
        const newFilteredData = productList.filter(item =>
            item && (
            (item.name && item.name.toLowerCase().includes(val.toLowerCase())) ||
            (item.type && item.type.toLowerCase().includes(val.toLowerCase())) ||
            (item.brand && item.brand.toLowerCase().includes(val.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(val.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(val.toLowerCase()))
            )
        );
        setFilteredData(newFilteredData);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilteredData([]);
    };

    return (
        <Container className="search-section-wrapper" maxWidth="md">
            {/* Category Quick Filter Chips */}
            <div className="category-chips-wrapper">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => onSelectCategory && onSelectCategory(cat.value)}
                        className={`category-chip ${selectedCategory === cat.value ? 'active' : ''}`}
                    >
                        {cat.value === 'all' && <Sparkles size={14} style={{ marginRight: 4 }} />}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Main Search Input */}
            <div className="search-input-container">
                <Search size={22} className="search-icon-left" />
                <input
                    type="text"
                    placeholder="Search chronographs, luxury perfumes, men/women/kids watches..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input-field"
                />
                {searchTerm && (
                    <button onClick={handleClear} className="search-clear-btn" aria-label="Clear search">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Live Search Results Dropdown */}
            {searchTerm.length > 0 && (
                <div className="search-results-dropdown">
                    {filteredData.length === 0 ? (
                        <div className="search-no-results">
                            <Typography variant="body1" fontWeight="600" color="#64748b">
                                No matching products found for "{searchTerm}"
                            </Typography>
                        </div>
                    ) : (
                        <div className="search-results-list">
                            <div className="search-results-header">
                                <span>Found {filteredData.length} items</span>
                            </div>
                            {Array.isArray(filteredData) && filteredData.slice(0, 8).map(product => (
                                <Link
                                    to={`/Detail/type/${product.type}/${product._id}`}
                                    key={product._id}
                                    className="search-result-item"
                                    onClick={handleClear}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="search-result-img"
                                    />
                                    <div className="search-result-info">
                                        <div className="search-result-title">{product.name}</div>
                                        <div className="search-result-meta">
                                            <span className="search-result-badge">{product.type}</span>
                                            {product.price && (
                                                <span className="search-result-price">${product.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="search-result-arrow" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Container>
    );
};

export default SearchBar;