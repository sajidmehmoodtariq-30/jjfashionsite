import React from 'react';
import styles from './Category.module.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ data }) => {
    const title = data.name || data.subCategory || "Category";
    const typeFilter = data.type || data.filter || "watches";
    const imgSrc = data.image || data.img;
    const badgeText = data.audience ? `${data.name || 'Category'} • ${data.audience}` : (typeFilter ? typeFilter.toUpperCase() : 'CATEGORY');
    const descriptionText = data.description || data.tagline || `Explore our premium ${title} collection`;

    return (
        <Link to={`/product/type/${typeFilter}`} style={{ textDecoration: 'none' }}>
            <div className={styles.mainCard}>
                <img src={imgSrc} alt={title} className={styles.mainImg} loading="lazy" />
                <div className={styles.overlay}>
                    <span className={styles.badge}>{badgeText}</span>
                    <h3 className={styles.imgTitle}>{title}</h3>
                    <p className={styles.tagline}>{descriptionText}</p>
                    <div className={styles.ctaRow}>
                        <span>Explore Collection</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;