"use client";

import { useState, useEffect } from "react";

interface HeroCarouselProps {
    images: string[];
    alt: string;
}

export default function HeroCarousel({ images, alt }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="hero-carousel">
            {images.map((src, i) => (
                <div
                    key={i}
                    className={`hero-carousel-slide ${i === activeIndex ? "active" : ""}`}
                    style={{ backgroundImage: `url(${src})` }}
                    aria-label={`${alt} ${i + 1}`}
                />
            ))}
        </div>
    );
}
