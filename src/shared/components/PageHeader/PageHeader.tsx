import React from 'react';

export interface PageHeaderProps {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    body?: React.ReactNode;
    bottom?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export interface HeaderSectionProps {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
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

export type PageHeaderComponent = React.FC<PageHeaderProps> & {
    Header: React.FC<HeaderSectionProps>;
    Title: React.FC<TitleProps>;
    Description: React.FC<DescriptionProps>;
    Actions: React.FC<ActionsProps>;
    Body: React.FC<SectionProps>;
    Bottom: React.FC<SectionProps>;
    Footer: React.FC<SectionProps>;
};

const HeaderTitle: React.FC<TitleProps> = ({ children, className = '', as: Tag = 'h1' }) => {
    return (
        <Tag className={`text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight ${className}`.trim()}>
            {children}
        </Tag>
    );
};

const HeaderDescription: React.FC<DescriptionProps> = ({ children, className = '' }) => {
    return (
        <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${className}`.trim()}>
            {children}
        </p>
    );
};

const HeaderActions: React.FC<ActionsProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex items-center flex-wrap gap-2.5 self-start sm:self-auto ${className}`.trim()}>
            {children}
        </div>
    );
};

const TopHeader: React.FC<HeaderSectionProps> = ({
    children,
    title,
    description,
    actions,
    className = ''
}) => {
    if (title || description || actions) {
        return (
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`.trim()}>
                <div>
                    {title && (typeof title === 'string' ? <HeaderTitle>{title}</HeaderTitle> : title)}
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
        <div className={className ? className : undefined}>
            {children}
        </div>
    );
};

const BottomSection: React.FC<SectionProps> = ({ children, className = '' }) => {
    if (!children) return null;
    return (
        <div className={className ? className : undefined}>
            {children}
        </div>
    );
};

export const PageHeader: PageHeaderComponent = ({
    children,
    title,
    description,
    actions,
    body,
    bottom,
    footer,
    className = ''
}) => {
    const bottomContent = footer ?? bottom;
    const hasDirectProps = Boolean(title || description || actions || body || bottomContent);

    return (
        <div className={`space-y-5 ${className}`.trim()}>
            {/* If direct props are provided, render standard sections */}
            {hasDirectProps && (
                <>
                    {(title || description || actions) && (
                        <TopHeader title={title} description={description} actions={actions} />
                    )}
                    {body && <BodySection>{body}</BodySection>}
                    {bottomContent && <BottomSection>{bottomContent}</BottomSection>}
                </>
            )}

            {/* If children are passed (compound components or custom elements) */}
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

export default PageHeader;
