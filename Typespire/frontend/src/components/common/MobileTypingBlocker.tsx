import React from 'react';

/**
 * MobileTypingBlocker
 *
 * Detects if the user is on a touch/mobile device and renders a full-screen
 * overlay that prevents them from accessing the typing interface.
 *
 * Detection strategy — ALL three signals must be true to block:
 *   1. Pointer device is "coarse"  (touchscreen hardware, true even in Chrome Desktop mode)
 *   2. navigator.maxTouchPoints > 0  (multi-touch hardware present)
 *   3. window.screen.width ≤ 900 px  (PHYSICAL screen — NOT innerWidth, which Chrome
 *      "Request Desktop Site" inflates to ~1280px to fake a desktop viewport)
 *
 * Why screen.width and not innerWidth:
 *   - innerWidth = the CSS viewport width  → changes with "Request Desktop Site"
 *   - screen.width = physical screen width → stays at the phone's real size (360-430px)
 *     regardless of what Chrome reports as the viewport.
 *
 * Desktop users with a touchscreen (Surface, iPad with keyboard) are
 * allowed through because screen.width is 1024+ on those devices.
 */

function isMobileDevice(): boolean {
    // 1. Coarse pointer = primary input is a touchscreen (not a mouse/stylus)
    //    Still true in Chrome "Request Desktop Site" — it reflects hardware, not UA.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // 2. Touch hardware is physically present on this device
    const hasTouch = navigator.maxTouchPoints > 0;

    // 3. Physical screen width is phone/small-tablet sized.
    //    screen.width is NOT affected by Chrome "Request Desktop Site" or zoom level.
    //    Most phones: 360-430 px. Tablets: 600-800 px. Desktops/laptops: 1024+ px.
    const smallPhysicalScreen = window.screen.width <= 900;

    return coarsePointer && hasTouch && smallPhysicalScreen;
}


interface Props {
    /** Child nodes to render when NOT on a mobile device */
    children: React.ReactNode;
}

const MobileTypingBlocker: React.FC<Props> = ({ children }) => {
    const [isMobile] = React.useState(() => isMobileDevice());

    if (!isMobile) {
        return <>{children}</>;
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: 'linear-gradient(135deg, #061824 0%, #0a2a3f 50%, #061824 100%)',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                minHeight: '100dvh',
                minWidth: '100dvw',
                overflowY: 'auto',
            }}
        >
            {/* Animated background dots */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: `${4 + (i % 5) * 3}px`,
                            height: `${4 + (i % 5) * 3}px`,
                            borderRadius: '50%',
                            background: i % 3 === 0 ? 'rgba(51,185,116,0.15)' : i % 3 === 1 ? 'rgba(9,74,113,0.2)' : 'rgba(255,255,255,0.05)',
                            left: `${(i * 17 + 5) % 100}%`,
                            top: `${(i * 23 + 10) % 100}%`,
                            animation: `float-dot ${3 + (i % 4)}s ease-in-out ${(i * 0.4) % 2}s infinite alternate`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes float-dot {
                    from { transform: translateY(0px) scale(1); opacity: 0.4; }
                    to   { transform: translateY(-12px) scale(1.15); opacity: 1; }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(1.35); opacity: 0; }
                }
                @keyframes slide-up-fade {
                    from { transform: translateY(24px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                .mob-block-card {
                    animation: slide-up-fade 0.5s ease both;
                    position: relative;
                    z-index: 1;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 28px;
                    padding: 2.5rem 2rem;
                    max-width: 360px;
                    width: 100%;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
                }
                .mob-block-icon-wrap {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }
                .mob-block-icon-wrap::before,
                .mob-block-icon-wrap::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    border: 2px solid rgba(9,74,113,0.5);
                    animation: pulse-ring 2s ease-out infinite;
                }
                .mob-block-icon-wrap::before {
                    width: 88px; height: 88px;
                    animation-delay: 0s;
                }
                .mob-block-icon-wrap::after {
                    width: 112px; height: 112px;
                    animation-delay: 0.5s;
                }
                .mob-block-icon {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #094A71, #0a6494);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 32px rgba(9,74,113,0.4);
                    position: relative; z-index: 1;
                }
                .mob-block-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0 0 0.75rem;
                    line-height: 1.25;
                    letter-spacing: -0.02em;
                }
                .mob-block-subtitle {
                    font-size: 0.875rem;
                    color: rgba(255,255,255,0.55);
                    line-height: 1.65;
                    margin: 0 0 2rem;
                }
                .mob-block-features {
                    display: flex;
                    flex-direction: column;
                    gap: 0.625rem;
                    margin-bottom: 2rem;
                }
                .mob-block-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 12px;
                    padding: 0.625rem 0.875rem;
                    text-align: left;
                }
                .mob-block-feature-icon {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 16px;
                }
                .mob-block-feature-text {
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.75);
                }
                .mob-block-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    background: rgba(51,185,116,0.12);
                    border: 1px solid rgba(51,185,116,0.25);
                    border-radius: 100px;
                    padding: 0.375rem 0.875rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #33B974;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .mob-block-divider {
                    width: 40px; height: 3px;
                    background: linear-gradient(90deg, #094A71, #33B974);
                    border-radius: 100px;
                    margin: 0 auto 1.25rem;
                }
            `}</style>

            <div className="mob-block-card">
                {/* Badge */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <span className="mob-block-badge">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>smartphone</span>
                        Mobile Device Detected
                    </span>
                </div>

                {/* Icon */}
                <div className="mob-block-icon-wrap">
                    <div className="mob-block-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'white' }}>
                            keyboard_hide
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="mob-block-divider" />

                {/* Text */}
                <h1 className="mob-block-title">
                    Typing Requires a<br />Physical Keyboard
                </h1>
                <p className="mob-block-subtitle">
                    Typespire is designed for real keyboard practice.
                    Connect a physical keyboard or switch to a desktop or
                    laptop to start typing tests and practice sessions.
                </p>

                {/* What you CAN do on mobile */}
                <div className="mob-block-features">
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: '0.25rem', textAlign: 'left' }}>
                        Available on Mobile
                    </p>
                    {[
                        { icon: 'dashboard', color: 'rgba(51,185,116,0.15)', iconColor: '#33B974', label: 'View your dashboard & stats' },
                        { icon: 'history',   color: 'rgba(9,74,113,0.2)',    iconColor: '#5aacdf', label: 'Browse your test history'   },
                        { icon: 'insights',  color: 'rgba(245,158,11,0.15)', iconColor: '#F59E0B', label: 'Check your progress & scores' },
                        { icon: 'assignment',color: 'rgba(139,92,246,0.15)', iconColor: '#8b5cf6', label: 'Review assigned tests'        },
                    ].map(({ icon, color, iconColor, label }) => (
                        <div key={icon} className="mob-block-feature-item">
                            <div className="mob-block-feature-icon" style={{ background: color }}>
                                <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: '16px' }}>{icon}</span>
                            </div>
                            <span className="mob-block-feature-text">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                    Use a desktop, laptop, or a device with a<br />physical keyboard to access typing features.
                </p>
            </div>
        </div>
    );
};

export default MobileTypingBlocker;
