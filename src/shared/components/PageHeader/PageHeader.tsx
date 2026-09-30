import React from 'react';

export interface PageHeaderProps {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    body?: React.ReactNode;
    bottom?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: 'card' | 'flat' | 'hero';
    withAccent?: boolean;
    className?: string;
}

export interface HeaderSectionProps {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    badge?: React.ReactNode;
    className?: string;
}

export interface TitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface DescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export interface ActionsProps {
    children: React.ReactNode;
    className?: string;
}

export interface SectionProps {
    children?: React.ReactNode;
    className?: string;
}

export interface MetricCardProps {
    label: string;
    value: React.ReactNode;
    subtext?: React.ReactNode;
    icon?: React.ReactNode;
    iconBg?: string;
    trend?: {
        value: string;
        isPositive?: boolean;
        label?: string;
    };
    badge?: React.ReactNode;
    valueColor?: string;
    accentColor?: 'emerald' | 'blue' | 'indigo' | 'purple' | 'amber' | 'rose' | 'slate';
    variant?: 'card' | 'divided' | 'minimal';
    className?: string;
    onClick?: () => void;
}

export interface MetricGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    variant?: 'cards' | 'divided';
    gap?: 'sm' | 'md' | 'lg' | 'none';
    className?: string;
}

export type PageHeaderComponent = React.FC<PageHeaderProps> & {
    Header: React.FC<HeaderSectionProps>;
    Title: React.FC<TitleProps>;
    Description: React.FC<DescriptionProps>;
    Actions: React.FC<ActionsProps>;
    Body: React.FC<SectionProps>;
    Bottom: React.FC<SectionProps>;
    Footer: React.FC<SectionProps>;
    MetricGrid: React.FC<MetricGridProps>;
    MetricCard: React.FC<MetricCardProps>;
};

/* ──────────────────────────────────────────────────────────── */

const HeaderTitle: React.FC<TitleProps> = ({ children, className = '', as: Tag = 'h1' }) => {
    return (
        <Tag className={`text-[15px] lg:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug ${className}`.trim()}>
            {children}
        </Tag>
    );
};

const HeaderDescription: React.FC<DescriptionProps> = ({ children, className = '' }) => {
    return (
        <p className={`text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed ${className}`.trim()}>
            {children}
        </p>
    );
};

const HeaderActions: React.FC<ActionsProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex items-center flex-wrap gap-2 self-start sm:self-auto shrink-0 ${className}`.trim()}>
            {children}
        </div>
    );
};

const TopHeader: React.FC<HeaderSectionProps> = ({
    children,
    title,
    description,
    actions,
    badge,
    className = ''
}) => {
    if (title || description || actions || badge) {
        return (
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`.trim()}>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {title && (typeof title === 'string' ? <HeaderTitle>{title}</HeaderTitle> : title)}
                        {badge && <div>{badge}</div>}
                    </div>
                    {description && (typeof description === 'string' ? <HeaderDescription>{description}</HeaderDescription> : description)}
                </div>
                {actions && <HeaderActions>{actions}</HeaderActions>}
                {children}
            </div>
        );
    }

    if (!children) return null;

    return (
        <div className={className ? className : undefined}>
            {children}
        </div>
    );
};

const BodySection: React.FC<SectionProps> = ({ children, className = '' }) => {
    if (!children) return null;
    return (
        <div className={`pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/60 ${className}`.trim()}>
            {children}
        </div>
    );
};

const BottomSection: React.FC<SectionProps> = ({ children, className = '' }) => {
    if (!children) return null;
    return (
        <div className={`pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 ${className}`.trim()}>
            {children}
        </div>
    );
};

const MetricGrid: React.FC<MetricGridProps> = ({
    children,
    cols = 4,
    variant = 'cards',
    gap = 'md',
    className = ''
}) => {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
    }[cols];

    if (variant === 'divided') {
        return (
            <div className={`grid ${colClasses} divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/60 ${className}`.trim()}>
                {children}
            </div>
        );
    }

    const gapClasses = {
        sm: 'gap-2 sm:gap-2.5',
        md: 'gap-2.5 sm:gap-3.5',
        lg: 'gap-3 sm:gap-4',
        none: 'gap-0'
    }[gap];

    return (
        <div className={`grid ${colClasses} ${gapClasses} ${className}`.trim()}>
            {children}
        </div>
    );
};

const ACCENT_COLORS = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
};

const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    subtext,
    icon,
    iconBg,
    trend,
    badge,
    valueColor = 'text-slate-900 dark:text-white',
    accentColor,
    variant = 'card',
    className = '',
    onClick
}) => {
    const isInteractive = Boolean(onClick);

    if (variant === 'divided') {
        return (
            <div
                onClick={onClick}
                className={`px-4 first:pl-0 last:pr-0 py-1 flex flex-col justify-center ${isInteractive ? 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors' : ''} ${className}`.trim()}>
                <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {label}
                    </span>
                    {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                    <span className={`text-lg sm:text-xl font-black font-mono tracking-tight leading-none ${valueColor}`}>
                        {value}
                    </span>
                    {trend && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                            {trend.value}
                        </span>
                    )}
                </div>
                {subtext && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                        {subtext}
                    </p>
                )}
            </div>
        );
    }

    const defaultIconStyle = accentColor
        ? ACCENT_COLORS[accentColor]
        : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60';

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#070d1a]/80 border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#0a1224] transition-all duration-200 shadow-2xs hover:shadow-xs ${isInteractive ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`.trim()}>
            {/* Top row: Label & Icon / Badge */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                    {label}
                </span>
                {icon ? (
                    <div className={`p-1.5 rounded-lg border text-xs shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${iconBg || defaultIconStyle}`}>
                        {icon}
                    </div>
                ) : badge ? (
                    <div className="shrink-0">{badge}</div>
                ) : null}
            </div>

            {/* Main Value & Trend */}
            <div className="mt-2 flex items-baseline justify-between gap-2">
                <div className={`text-lg sm:text-xl font-black font-mono tracking-tight leading-tight ${valueColor}`}>
                    {value}
                </div>
                {trend && (
                    <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 shrink-0 ${
                            trend.isPositive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                        {trend.value}
                    </span>
                )}
            </div>

            {/* Subtext */}
            {subtext && (
                <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                    {subtext}
                </div>
            )}
        </div>
    );
};

/* ──────────────────────────────────────────────────────────── */

export const PageHeader: PageHeaderComponent = ({
    children,
    title,
    description,
    actions,
    body,
    bottom,
    footer,
    variant = 'card',
    withAccent = true,
    className = ''
}) => {
    const bottomContent = footer ?? bottom;
    const hasDirectProps = Boolean(title || description || actions || body || bottomContent);

    let containerStyle = '';
    if (variant === 'card') {
        containerStyle = 'bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl px-5 py-4 shadow-sm relative overflow-hidden';
    } else if (variant === 'hero') {
        containerStyle = 'bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0a1020] dark:to-[#070c18] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl px-5 py-4 shadow-sm relative overflow-hidden';
    } else {
        containerStyle = '';
    }

    return (
        <div className={`${containerStyle} ${className}`.trim()}>
            {/* Top Accent Bar */}
            {withAccent && variant !== 'flat' && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
            )}

            {/* If direct props are provided */}
            {hasDirectProps && (
                <>
                    {(title || description || actions) && (
                        <TopHeader title={title} description={description} actions={actions} />
                    )}
                    {body && <BodySection>{body}</BodySection>}
                    {bottomContent && <BottomSection>{bottomContent}</BottomSection>}
                </>
            )}

            {/* If children are passed (compound components) */}
            {children}
        </div>
    );
};

PageHeader.Header = TopHeader;
PageHeader.Title = HeaderTitle;
PageHeader.Description = HeaderDescription;
PageHeader.Actions = HeaderActions;
PageHeader.Body = BodySection;
PageHeader.Bottom = BottomSection;
PageHeader.Footer = BottomSection;
PageHeader.MetricGrid = MetricGrid;
PageHeader.MetricCard = MetricCard;

export default PageHeader;
