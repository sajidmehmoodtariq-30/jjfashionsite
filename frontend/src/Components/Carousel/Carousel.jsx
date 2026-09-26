import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import BannerData from '../../Helpers/HomePageBanner';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import './Carousel.css';

const Carousel = () => {
    const slideInfo = [
        {
            tag: "⌚ MEN'S LUXURY TIMEPIECES",
            title: "Precision Chronographs & Executive Steel",
            subtitle: "Masterfully engineered watch designs built for sophistication, accuracy & executive elegance.",
            cat: "watches",
        },
        {
            tag: "✨ WOMEN'S ELEGANT WATCHES",
            title: "Rose Gold & Diamond Accent Watches",
            subtitle: "Delicate craftsmanship meeting modern glamour for statement wrists.",
            cat: "watches",
        },
        {
            tag: "🎈 KIDS' DIGITAL & SMART WATCHES",
            title: "Fun, Durable & Smart Watches for Kids",
            subtitle: "Vibrant water-resistant timepieces designed for active young adventurers.",
            cat: "watches",
        },
        {
            tag: "🔥 MEN'S SIGNATURE COLOGNES",
            title: "Bold Woody, Amber & Spice Scents",
            subtitle: "Intense, long-lasting fragrances designed to leave an unforgettable impression.",
            cat: "perfumes",
        },
        {
            tag: "🌸 WOMEN'S EAU DE PARFUM",
            title: "Luxurious Floral & Sensual Fragrances",
            subtitle: "Captivating bouquet of French flora, sweet vanilla, and exotic luxury notes.",
            cat: "perfumes",
        },
    ];

    const items = BannerData.map((item, index) => {
        const info = slideInfo[index % slideInfo.length];
        return (
            <div className="hero-slide" key={item.subCategory + index}>
                <div className="hero-glow-1"></div>
                <div className="hero-glow-2"></div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} color="#f59e0b" />
                        <span>{info.tag}</span>
                    </div>
                    <h1 className="hero-title">{info.title}</h1>
                    <p className="hero-subtitle">{info.subtitle}</p>
                    <div className="hero-btn-group">
                        <Link to={`product/type/${item.filter}`} className="btn-primary-glow">
                            <ShoppingBag size={18} />
                            Shop {item.subCategory}
                            <ArrowRight size={18} />
                        </Link>
                        <Link to={`product/type/${item.filter}`} className="btn-secondary-glass">
                            Explore {item.name}
                        </Link>
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <img
                        src={item.img}
                        loading="lazy"
                        alt={item.subCategory}
                        className="hero-image"
                    />
                </div>
            </div>
        );
    });

    return (
        <div className="hero-carousel-wrapper">
            <AliceCarousel
                animationType="fadeout"
                animationDuration={1000}
                disableButtonsControls
                infinite
                items={items}
                touchTracking
                mouseTracking
                autoPlay
                autoPlayInterval={4000}
            />
        </div>
    );
};

export default Carousel;