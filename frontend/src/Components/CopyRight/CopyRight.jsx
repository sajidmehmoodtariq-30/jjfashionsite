import React from 'react';
import { Container, Grid } from '@mui/material';
import { Mail, ArrowRight, Github, Twitter, Instagram, Linkedin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jjLogo } from '../../Assets/Images/Image';
import './CopyRight.css';

const CopyRight = () => {
    return (
        <footer className="footer-wrapper">
            <Container maxWidth="xl">
                <Grid container spacing={4} className="footer-grid">
                    {/* Brand Info */}
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <img src={jjLogo} alt="JJ Fashion Hub" className="footer-logo-img" />
                                <div className="footer-brand-title">
                                    <span>JJ FASHION HUB</span>
                                    <small className="footer-tagline">STYLE FOR EVERY YOU</small>
                                </div>
                            </div>
                            <p className="footer-desc">
                                Your ultimate destination for luxury menswear, women's designer apparel, playful kids fashion, chronographs, and signature perfumes. Style tailored for every you.
                            </p>
                            <div className="social-links">
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Github"><Github size={18} /></a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={18} /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            </div>
                        </div>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} sm={6} md={2}>
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/cart">My Cart</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/admin/login" className="admin-portal-link"><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} />Admin Portal</Link></li>
                        </ul>
                    </Grid>

                    {/* Shop Categories */}
                    <Grid item xs={6} sm={6} md={2}>
                        <h4 className="footer-title">Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/product/type/men">Men's Fashion</Link></li>
                            <li><Link to="/product/type/women">Women's Apparel</Link></li>
                            <li><Link to="/product/type/kids">Kids' Collection</Link></li>
                            <li><Link to="/product/type/watches">Luxury Watches</Link></li>
                            <li><Link to="/product/type/perfumes">Fragrances & Perfumes</Link></li>
                        </ul>
                    </Grid>

                    {/* Newsletter Subscription */}
                    <Grid item xs={12} sm={12} md={4}>
                        <h4 className="footer-title">Newsletter</h4>
                        <p className="footer-newsletter-text">
                            Subscribe to receive exclusive access to JJ Fashion Hub drops, private sales, and seasonal discounts.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="newsletter-input-group">
                                <Mail size={18} className="newsletter-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address..."
                                    required
                                    className="newsletter-input"
                                />
                                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </Grid>
                </Grid>

                <div className="footer-bottom">
                    <p className="copyright-text">
                        © {new Date().getFullYear()} <strong>JJ FASHION HUB</strong>. All rights reserved. Style For Every You.
                    </p>
                    <div className="footer-trust-badges">
                        <span className="trust-badge">🔒 256-Bit SSL Encrypted</span>
                        <span className="trust-badge">⚡ Express Shipping</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default CopyRight;