import React from 'react';
import { Card, CardActionArea, CardActions, Rating, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export default function ProductCard({ prod }) {
    if (!prod) return null;
    
    return (
        <Card className={styles.main_card} elevation={0}>
            {prod.type && (
                <span className={styles.badge}>{prod.type}</span>
            )}
            <Link to={`/Detail/type/${prod.type}/${prod._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardActionArea sx={{ borderRadius: '14px' }}>
                    <Box className={styles.cart_box}>
                        <img alt={prod.name} src={prod.image} loading="lazy" className={styles.cart_img} />
                    </Box>
                    <CardContent className={styles.card_content}>
                        <Typography variant="h6" className={styles.title}>
                            {prod.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions className={styles.card_actions}>
                <Typography className={styles.price}>
                    ₹{prod.price}
                </Typography>
                <Rating
                    precision={0.5}
                    name="read-only"
                    value={prod.rating || 4.5}
                    readOnly
                    size="small"
                />
            </CardActions>
        </Card>
    );
}