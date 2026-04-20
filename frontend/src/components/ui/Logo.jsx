import { Link } from 'react-router';

// =============================================================
//  Logo.jsx — LearnX Official Logo Component
//  Custom SVG mark: open book + rising spark (knowledge & growth)
//  Fully responsive, no external images, theme-aware.
// =============================================================

const Logo = ({
    className = '',
    size = 'md',
    isDark = false,
    to = '/',
    disableLink = false,
    onClick = null,
}) => {
    const sizes = {
        sm:  { iconSize: 24, text: 'text-base',  gap: 'gap-1.5' },
        md:  { iconSize: 30, text: 'text-xl',    gap: 'gap-2'   },
        lg:  { iconSize: 36, text: 'text-2xl',   gap: 'gap-2.5' },
        xl:  { iconSize: 44, text: 'text-3xl',   gap: 'gap-3'   },
        '2xl':{ iconSize: 56, text: 'text-4xl',  gap: 'gap-3.5' },
    };

    const s = sizes[size] || sizes.md;
    const n = s.iconSize;

    const textBase  = isDark ? 'text-white'     : 'text-slate-900';
    const accentCol = isDark ? 'text-indigo-400' : 'text-indigo-600';

    const Wrapper = disableLink ? 'div' : Link;
    const wrapperProps = disableLink ? { onClick } : { to };

    return (
        <Wrapper
            {...wrapperProps}
            className={`group inline-flex items-center shrink-0 outline-none select-none
                ${disableLink && onClick ? 'cursor-pointer' : ''} ${s.gap} ${className}`}
        >
            {/* ── Brand Mark ── */}
            <svg
                width={n}
                height={n}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform duration-300 group-hover:scale-105"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="lx-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                    <linearGradient id="lx-spark" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#a5b4fc"/>
                        <stop offset="100%" stopColor="#c4b5fd"/>
                    </linearGradient>
                </defs>

                {/* Background pill */}
                <rect width="48" height="48" rx="14" fill="url(#lx-grad)"/>

                {/* Open book — left page */}
                <path
                    d="M24 33V17C24 17 19 15 13 16.5V33C19 31.5 24 33 24 33Z"
                    fill="white"
                    fillOpacity="0.92"
                />
                {/* Open book — right page */}
                <path
                    d="M24 33V17C24 17 29 15 35 16.5V33C29 31.5 24 33 24 33Z"
                    fill="white"
                    fillOpacity="0.6"
                />
                {/* Book spine */}
                <line x1="24" y1="17" x2="24" y2="33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>

                {/* Rising spark / bolt — represents growth & mastery */}
                <path
                    d="M28 11 L25 18 H29 L26 25"
                    stroke="url(#lx-spark)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* ── Wordmark ── */}
            <span className={`${s.text} font-extrabold tracking-tight leading-none ${textBase}`}>
                Learn<span className={accentCol}>X</span>
            </span>
        </Wrapper>
    );
};

export default Logo;

