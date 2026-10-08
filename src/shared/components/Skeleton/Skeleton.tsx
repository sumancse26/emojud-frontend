import React from 'react';

// ─── Types & Interfaces ────────────────────────────────────────────────────────

export type SkeletonVariant = 'text' | 'circular' | 'rounded' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Shape variant of the skeleton */
    variant?: SkeletonVariant;
    /** Width (e.g. '100%', 200, '4rem') */
    width?: string | number;
    /** Height (e.g. '1rem', 40, '100%') */
    height?: string | number;
    /** Number of skeleton items to repeat */
    count?: number;
    /** Animation style */
    animation?: SkeletonAnimation;
    /** Additional CSS classes */
    className?: string;
}

export interface SkeletonCardProps {
    /** Number of cards to render */
    count?: number;
    /** Tailwind grid columns classes (e.g. "grid-cols-1 md:grid-cols-2") */
    gridCols?: string;
    /** Whether to show top-left icon avatar placeholder */
    hasIcon?: boolean;
    /** Whether to show top-right badge placeholder */
    hasBadge?: boolean;
    /** Number of middle content rows to simulate */
    lines?: number;
    /** Whether to show bottom action/stat footer */
    hasFooter?: boolean;
    /** Custom card container className */
    className?: string;
}

export interface SkeletonTableProps {
    /** Number of body rows */
    rows?: number;
    /** Number of columns */
    columns?: number;
    /** Whether to render a table header row */
    hasHeader?: boolean;
    /** Custom table wrapper className */
    className?: string;
}

export interface SkeletonListProps {
    /** Number of list items */
    count?: number;
    /** Whether each item has an avatar/icon on the left */
    hasAvatar?: boolean;
    /** Number of text lines per item */
    lines?: number;
    /** Custom list container className */
    className?: string;
}

export interface SkeletonStatsProps {
    /** Number of stat metric cards */
    count?: number;
    /** Grid column configuration */
    gridCols?: string;
    /** Custom container className */
    className?: string;
}

// ─── Base Skeleton Primitive ───────────────────────────────────────────────────

const variantClasses: Record<SkeletonVariant, string> = {
    text: 'rounded-md h-3.5 my-1',
    circular: 'rounded-full shrink-0',
    rounded: 'rounded-xl',
    rectangular: 'rounded-none'
};

export const Skeleton: React.FC<SkeletonProps> & {
    Card: React.FC<SkeletonCardProps>;
    Table: React.FC<SkeletonTableProps>;
    List: React.FC<SkeletonListProps>;
    Stats: React.FC<SkeletonStatsProps>;
} = ({
    variant = 'rounded',
    width,
    height,
    count = 1,
    animation = 'pulse',
    className = '',
    style,
    ...props
}) => {
    const animationClass =
        animation === 'pulse'
            ? 'animate-pulse'
            : animation === 'wave'
            ? 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent'
            : '';

    const baseClass = `bg-slate-200/80 dark:bg-slate-800/80 ${variantClasses[variant]} ${animationClass} ${className}`;

    const customStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
    };

    if (count > 1) {
        return (
            <>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={baseClass}
                        style={customStyle}
                        aria-hidden="true"
                        {...props}
                    />
                ))}
            </>
        );
    }

    return (
        <div
            className={baseClass}
            style={customStyle}
            aria-hidden="true"
            {...props}
        />
    );
};

// ─── 1. Card Grid Skeleton Preset ──────────────────────────────────────────────

Skeleton.Card = ({
    count = 4,
    gridCols = 'grid-cols-1 md:grid-cols-2',
    hasIcon = true,
    hasBadge = true,
    lines = 2,
    hasFooter = true,
    className = ''
}) => {
    return (
        <div className={`grid ${gridCols} gap-4 ${className}`} aria-hidden="true">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl p-5 shadow-2xs space-y-4 animate-pulse flex flex-col justify-between">
                    <div>
                        {/* Header: Icon + Title/Subtitle + Badge */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                                {hasIcon && (
                                    <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                                )}
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/5" />
                                    <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded-md w-2/5" />
                                </div>
                            </div>
                            {hasBadge && (
                                <div className="w-16 h-5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shrink-0" />
                            )}
                        </div>

                        {/* Middle Content Lines */}
                        {lines > 0 && (
                            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                                {Array.from({ length: lines }).map((_, lineIdx) => (
                                    <div
                                        key={lineIdx}
                                        className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded-md"
                                        style={{ width: `${85 - lineIdx * 20}%` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action / Footer */}
                    {hasFooter && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                            <div className="h-3 bg-slate-200/60 dark:bg-slate-800/60 rounded-md w-1/3" />
                            <div className="h-3 bg-slate-200/60 dark:bg-slate-800/60 rounded-md w-1/4" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─── 2. Table Skeleton Preset ──────────────────────────────────────────────────

Skeleton.Table = ({
    rows = 5,
    columns = 6,
    hasHeader = true,
    className = ''
}) => {
    return (
        <div
            className={`bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden animate-pulse ${className}`}
            aria-hidden="true">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    {hasHeader && (
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <th key={colIdx} className="px-5 py-3.5">
                                        <div
                                            className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md"
                                            style={{ width: colIdx === 0 ? '60%' : '40%' }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr key={rowIdx}>
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <td key={colIdx} className="px-5 py-4">
                                        <div
                                            className="h-3.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-md"
                                            style={{
                                                width: colIdx === 0 ? '75%' : colIdx === 1 ? '50%' : '35%'
                                            }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── 3. List Skeleton Preset ───────────────────────────────────────────────────

Skeleton.List = ({
    count = 4,
    hasAvatar = true,
    lines = 2,
    className = ''
}) => {
    return (
        <div className={`space-y-3 ${className}`} aria-hidden="true">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-xl animate-pulse">
                    <div className="flex items-center gap-3.5 flex-1">
                        {hasAvatar && (
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                        )}
                        <div className="space-y-2 flex-1">
                            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-2/5" />
                            {lines > 1 && (
                                <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded-md w-1/4" />
                            )}
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 shrink-0" />
                </div>
            ))}
        </div>
    );
};

// ─── 4. Stats / KPI Cards Skeleton Preset ──────────────────────────────────────

Skeleton.Stats = ({
    count = 4,
    gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    className = ''
}) => {
    return (
        <div className={`grid ${gridCols} gap-4 ${className}`} aria-hidden="true">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="p-5 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl animate-pulse space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                        <div className="w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 shrink-0" />
                    </div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/5" />
                    <div className="h-2.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-md w-2/5" />
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
