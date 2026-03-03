'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles, PartyPopper, ThumbsUp } from 'lucide-react';

const BB_PINK = '#FF1493';
const BB_BLUE = '#00BFFF';
const BB_YELLOW = '#FFD700';
const BASE_FONT = '"Changa", "Almarai", sans-serif';

interface BookingModalTriggerProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    locale?: string;
}

export default function BookingModalTrigger({ children, className, style, locale = 'ar' }: BookingModalTriggerProps) {
    const [open, setOpen] = useState(false);
    const isAr = locale === 'ar';

    const modal = open && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100000,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    direction: isAr ? 'rtl' : 'ltr',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 40 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        background: '#fff',
                        borderRadius: '3rem',
                        padding: '3.5rem 3rem',
                        maxWidth: 480,
                        width: '100%',
                        textAlign: 'center',
                        border: `6px solid ${BB_YELLOW}`,
                        boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative top gradient */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: `linear-gradient(90deg, ${BB_PINK}, ${BB_BLUE}, ${BB_YELLOW})`,
                        borderRadius: '3rem 3rem 0 0',
                    }} />

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: isAr ? undefined : 20,
                            left: isAr ? 20 : undefined,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af'; }}
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>

                    {/* Icon */}
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${BB_BLUE}20, ${BB_PINK}20)`,
                            border: `4px solid ${BB_YELLOW}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            boxShadow: '0 10px 30px rgba(0,191,255,0.15)',
                        }}
                    >
                        <Clock size={48} color={BB_BLUE} strokeWidth={2} />
                    </motion.div>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: BASE_FONT,
                        fontWeight: 900,
                        fontSize: '1.8rem',
                        color: BB_BLUE,
                        marginBottom: '1rem',
                        lineHeight: 1.3,
                    }}>
                        {isAr ? (<>قريباً <PartyPopper size={24} color={BB_PINK} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>) : (<>Coming Soon <PartyPopper size={24} color={BB_PINK} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>)}
                    </h3>

                    {/* Message */}
                    <p style={{
                        fontFamily: BASE_FONT,
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        color: '#6b7280',
                        marginBottom: '2rem',
                        lineHeight: 1.7,
                    }}>
                        {isAr
                            ? 'لم يتم تفعيل خدمة الحجز بعد، نعمل على تجهيزها لكم في أقرب وقت!'
                            : 'The booking service is not yet activated. We are working on it and it will be available soon!'}
                    </p>

                    {/* Sparkle divider */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ height: 2, flex: 1, background: `linear-gradient(to ${isAr ? 'left' : 'right'}, transparent, ${BB_YELLOW})` }} />
                        <Sparkles size={20} color={BB_YELLOW} strokeWidth={2.5} />
                        <div style={{ height: 2, flex: 1, background: `linear-gradient(to ${isAr ? 'right' : 'left'}, transparent, ${BB_YELLOW})` }} />
                    </div>

                    {/* Close CTA */}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        style={{
                            fontFamily: BASE_FONT,
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            background: `linear-gradient(135deg, ${BB_PINK}, ${BB_BLUE})`,
                            color: '#fff',
                            border: '4px solid #fff',
                            borderRadius: '1.5rem',
                            padding: '1rem 3rem',
                            cursor: 'pointer',
                            boxShadow: `0 8px 0 rgba(0,0,0,0.1), 0 15px 40px ${BB_PINK}40`,
                            transition: 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 0 rgba(0,0,0,0.05), 0 20px 50px ${BB_PINK}50`; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 8px 0 rgba(0,0,0,0.1), 0 15px 40px ${BB_PINK}40`; }}
                    >
                        {isAr ? (<>حسناً، فهمت! <ThumbsUp size={20} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>) : (<>Got it! <ThumbsUp size={20} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} /></>)}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );

    return (
        <>
            <span
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
                className={className}
                style={{ ...style, cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setOpen(true); }}
            >
                {children}
            </span>
            {modal}
        </>
    );
}
