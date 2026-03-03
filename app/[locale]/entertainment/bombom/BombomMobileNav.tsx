'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Clock, Sparkles, PartyPopper, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const BB_PINK = '#FF1493';
const BB_BLUE = '#00BFFF';
const BB_YELLOW = '#FFD700';
const BASE_FONT = '"Changa", "Almarai", sans-serif';

interface BombomMobileNavProps {
    locale: string;
    homeLabel: string;
    zonesLabel: string;
    bookNowLabel: string;
}

export default function BombomMobileNav({
    locale,
    homeLabel,
    zonesLabel,
    bookNowLabel,
}: BombomMobileNavProps) {
    const [open, setOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isAr = locale === 'ar';

    useEffect(() => setMounted(true), []);

    // Close menu on outside click / escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const links = [
        { label: homeLabel, href: `/${locale}/home` },
        { label: isAr ? 'الترفيه' : 'Entertainment', href: `/${locale}/entertainment` },
        { label: zonesLabel, href: '#zones' },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Hamburger / X Toggle */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: open ? BB_PINK : 'rgba(0,191,255,0.12)',
                    border: `2px solid ${open ? BB_PINK : 'rgba(0,191,255,0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: open ? '#fff' : BB_BLUE,
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="x"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu size={20} strokeWidth={2.5} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Slide-down Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -12, scaleY: 0.9 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -12, scaleY: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{
                            position: 'fixed',
                            top: '5.5rem',
                            left: '1rem',
                            right: '1rem',
                            zIndex: 9999,
                            background: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '2rem',
                            padding: '1.5rem',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            border: `3px solid rgba(0,191,255,0.15)`,
                            transformOrigin: 'top',
                            direction: isAr ? 'rtl' : 'ltr',
                        }}
                    >
                        {/* Colored top strip */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 5,
                            background: `linear-gradient(90deg, ${BB_PINK}, ${BB_BLUE}, ${BB_YELLOW})`,
                            borderRadius: '2rem 2rem 0 0',
                        }} />

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    {link.href.startsWith('#') ? (
                                        <a
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            style={{
                                                display: 'block',
                                                fontFamily: BASE_FONT,
                                                fontWeight: 900,
                                                fontSize: '1.2rem',
                                                color: BB_BLUE,
                                                textDecoration: 'none',
                                                padding: '0.9rem 1.2rem',
                                                borderRadius: '1rem',
                                                transition: 'background 0.2s',
                                                background: 'transparent',
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,191,255,0.08)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            style={{
                                                display: 'block',
                                                fontFamily: BASE_FONT,
                                                fontWeight: 900,
                                                fontSize: '1.2rem',
                                                color: BB_BLUE,
                                                textDecoration: 'none',
                                                padding: '0.9rem 1.2rem',
                                                borderRadius: '1rem',
                                                transition: 'background 0.2s',
                                                background: 'transparent',
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,191,255,0.08)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                            {/* Book Now inside menu */}
                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: links.length * 0.06 }}
                                style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(0,191,255,0.12)', paddingTop: '0.75rem' }}
                            >
                                <button
                                    type="button"
                                    onClick={() => { setOpen(false); setBookingOpen(true); }}
                                    style={{
                                        width: '100%',
                                        fontFamily: BASE_FONT,
                                        fontWeight: 900,
                                        fontSize: '1.2rem',
                                        background: `linear-gradient(135deg, ${BB_PINK}, #ff69b4)`,
                                        color: '#fff',
                                        border: '3px solid #fff',
                                        borderRadius: '1.25rem',
                                        padding: '0.9rem',
                                        cursor: 'pointer',
                                        boxShadow: `0 6px 0 rgba(0,0,0,0.1), 0 10px 25px ${BB_PINK}30`,
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {bookNowLabel}
                                </button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9998,
                    }}
                />
            )}
            {/* Booking Not Active Modal */}
            {mounted && bookingOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setBookingOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', direction: isAr ? 'rtl' : 'ltr' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 40 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'relative', background: '#fff', borderRadius: '3rem', padding: '3rem 2.5rem', maxWidth: 440, width: '100%', textAlign: 'center', border: `6px solid ${BB_YELLOW}`, boxShadow: '0 30px 80px rgba(0,0,0,0.2)', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(90deg, ${BB_PINK}, ${BB_BLUE}, ${BB_YELLOW})`, borderRadius: '3rem 3rem 0 0' }} />
                            <button type="button" onClick={() => setBookingOpen(false)} style={{ position: 'absolute', top: 16, [isAr ? 'left' : 'right']: 16, width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                <X size={18} strokeWidth={2.5} />
                            </button>
                            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${BB_BLUE}20, ${BB_PINK}20)`, border: `4px solid ${BB_YELLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 30px rgba(0,191,255,0.15)' }}>
                                <Clock size={42} color={BB_BLUE} strokeWidth={2} />
                            </motion.div>
                            <h3 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: '1.7rem', color: BB_BLUE, marginBottom: '0.75rem' }}>
                                {isAr ? (<>قريباً <PartyPopper size={22} color={BB_PINK} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>) : (<>Coming Soon <PartyPopper size={22} color={BB_PINK} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>)}
                            </h3>
                            <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: '1.05rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                                {isAr ? 'لم يتم تفعيل خدمة الحجز بعد، نعمل على تجهيزها لكم في أقرب وقت!' : 'The booking service is not yet activated. We are working on it and it will be available soon!'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ height: 2, flex: 1, background: `linear-gradient(to ${isAr ? 'left' : 'right'}, transparent, ${BB_YELLOW})` }} />
                                <Sparkles size={18} color={BB_YELLOW} strokeWidth={2.5} />
                                <div style={{ height: 2, flex: 1, background: `linear-gradient(to ${isAr ? 'right' : 'left'}, transparent, ${BB_YELLOW})` }} />
                            </div>
                            <button type="button" onClick={() => setBookingOpen(false)} style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: '1.1rem', background: `linear-gradient(135deg, ${BB_PINK}, ${BB_BLUE})`, color: '#fff', border: '3px solid #fff', borderRadius: '1.25rem', padding: '0.9rem 2.5rem', cursor: 'pointer', boxShadow: `0 6px 0 rgba(0,0,0,0.1)` }}>
                                {isAr ? (<>حسناً، فهمت! <ThumbsUp size={18} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>) : (<>Got it! <ThumbsUp size={18} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>)}
                            </button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
