import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, Check, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
    /** Unique value identifier */
    value: string;
    /** Display label text */
    label: string;
    /** Optional secondary / subtitle text */
    subLabel?: string;
    /** Optional icon element rendered on the left */
    icon?: React.ReactNode;
    /** Disabled state for this option */
    disabled?: boolean;
}

export interface DropdownProps {
    /** List of selectable options */
    options: DropdownOption[];
    /** Currently selected value */
    value?: string;
    /** Selection callback */
    onChange?: (value: string, option?: DropdownOption) => void;
    /** Placeholder text when nothing is selected */
    placeholder?: string;
    /** Top label text */
    label?: string;
    /** Whether to render the label above the trigger */
    showLabel?: boolean;
    /** Visual variant */
    variant?: 'default' | 'sidebar' | 'compact' | 'pill';
    /** Enable built-in search when options > threshold */
    searchable?: boolean | number;
    /** Custom search placeholder */
    searchPlaceholder?: string;
    /** Show a loading state */
    isLoading?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Additional wrapper class */
    className?: string;
    /** Left icon rendered inside the trigger */
    triggerIcon?: React.ReactNode;
    /** Show a footer counter */
    showCount?: boolean;
    /** Required field indicator */
    required?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    label,
    showLabel = false,
    variant = 'default',
    searchable = 5,
    searchPlaceholder = 'Search...',
    isLoading = false,
    disabled = false,
    className = '',
    triggerIcon,
    showCount = false,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Determine whether search is visible
    const searchThreshold = typeof searchable === 'number' ? searchable : searchable ? 0 : Infinity;
    const showSearch = options.length > searchThreshold;

    // Find the selected option
    const selectedOption = useMemo(
        () => options.find((o) => o.value === value),
        [options, value]
    );

    // Filtered options by search
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        const q = searchQuery.toLowerCase();
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(q) ||
                o.subLabel?.toLowerCase().includes(q) ||
                o.value.toLowerCase().includes(q)
        );
    }, [options, searchQuery]);

    // ─── Close on outside click ───────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Focus search when opening ────────────────────────────────────
    useEffect(() => {
        if (isOpen && showSearch && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen, showSearch]);

    // ─── Scroll highlighted item into view ────────────────────────────
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-dropdown-option]');
            items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    const toggleOpen = useCallback(() => {
        if (disabled || isLoading) return;
        setIsOpen((prev) => {
            if (!prev) {
                setSearchQuery('');
                setHighlightedIndex(-1);
            }
            return !prev;
        });
    }, [disabled, isLoading]);

    const handleSelect = useCallback(
        (opt: DropdownOption) => {
            if (opt.disabled) return;
            onChange?.(opt.value, opt);
            setIsOpen(false);
            setSearchQuery('');
            setHighlightedIndex(-1);
        },
        [onChange]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen) {
                if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                    toggleOpen();
                }
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredOptions.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                        handleSelect(filteredOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setSearchQuery('');
                    setHighlightedIndex(-1);
                    break;
            }
        },
        [isOpen, highlightedIndex, filteredOptions, toggleOpen, handleSelect]
    );

    // ─── Variant-based trigger classes ────────────────────────────────
    const triggerClasses = useMemo(() => {
        const base =
            'w-full flex items-center gap-2 cursor-pointer transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed';
        const ring = isOpen
            ? 'ring-2 ring-emerald-500/30 border-emerald-500/50 dark:border-emerald-500/40'
            : '';
        switch (variant) {
            case 'sidebar':
                return `${base} bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-2.5 py-2.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${ring}`;
            case 'compact':
                return `${base} bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus-visible:ring-1 focus-visible:ring-emerald-500/30 ${ring}`;
            case 'pill':
                return `${base} bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${ring}`;
            default:
                return `${base} bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 ${ring}`;
        }
    }, [variant, isOpen]);

    const textSizeClass = variant === 'compact' || variant === 'pill' ? 'text-[11px]' : 'text-xs';
    const isPlaceholder = !selectedOption;

    return (
        <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
            {/* ─── Label ──────────────────────────────────────────────── */}
            {showLabel && label && (
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {label}
                    {required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
            )}

            {/* ─── Trigger Button ─────────────────────────────────────── */}
            <button
                type="button"
                onClick={toggleOpen}
                disabled={disabled || isLoading}
                className={triggerClasses}
                aria-haspopup="listbox"
                aria-expanded={isOpen}>
                {/* Left icon */}
                {isLoading ? (
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
                ) : (
                    triggerIcon && <span className="shrink-0 flex items-center">{triggerIcon}</span>
                )}

                {/* Display text */}
                <span
                    className={`${textSizeClass} font-semibold truncate flex-1 text-left ${
                        isPlaceholder
                            ? 'text-slate-400 dark:text-slate-500'
                            : variant === 'pill'
                              ? 'text-emerald-800 dark:text-emerald-300'
                              : 'text-slate-800 dark:text-slate-100'
                    }`}>
                    {isLoading ? 'Loading...' : selectedOption ? selectedOption.label : placeholder}
                </span>

                {/* Chevron */}
                <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* ─── Dropdown Panel ─────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="absolute left-0 right-0 mt-1.5 z-[100] origin-top
                        bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-700/60
                        rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/40
                        overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                    role="listbox">
                    {/* ─── Search ──────────────────────────────────────── */}
                    {showSearch && (
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800/60">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setHighlightedIndex(-1);
                                    }}
                                    placeholder={searchPlaceholder}
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition"
                                />
                            </div>
                        </div>
                    )}

                    {/* ─── Options List ────────────────────────────────── */}
                    <div
                        ref={listRef}
                        className="max-h-52 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                        {filteredOptions.map((opt, idx) => {
                            const isSelected = value === opt.value;
                            const isHighlighted = highlightedIndex === idx;

                            return (
                                <button
                                    type="button"
                                    key={opt.value}
                                    data-dropdown-option
                                    onClick={() => handleSelect(opt)}
                                    disabled={opt.disabled}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors duration-100 cursor-pointer
                                        ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                                        ${isSelected ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''}
                                        ${isHighlighted && !isSelected ? 'bg-slate-100 dark:bg-slate-800/80' : ''}
                                        ${!isSelected && !isHighlighted && !opt.disabled ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''}`}
                                    role="option"
                                    aria-selected={isSelected}>
                                    {/* Option icon */}
                                    {opt.icon && (
                                        <span className="shrink-0 flex items-center">{opt.icon}</span>
                                    )}

                                    {/* Label + sub-label */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`font-semibold truncate leading-tight ${
                                                isSelected
                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                    : 'text-slate-800 dark:text-slate-200'
                                            }`}>
                                            {opt.label}
                                        </p>
                                        {opt.subLabel && (
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                                                {opt.subLabel}
                                            </p>
                                        )}
                                    </div>

                                    {/* Check icon */}
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Empty state */}
                        {filteredOptions.length === 0 && !isLoading && (
                            <div className="px-3 py-6 text-center">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    {searchQuery ? 'No results found' : 'No options available'}
                                </p>
                            </div>
                        )}

                        {/* Loading state */}
                        {isLoading && (
                            <div className="px-3 py-6 text-center">
                                <Loader2 className="w-5 h-5 mx-auto text-emerald-500 animate-spin mb-1.5" />
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Loading...</p>
                            </div>
                        )}
                    </div>

                    {/* ─── Footer ──────────────────────────────────────── */}
                    {showCount && options.length > 0 && (
                        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                {filteredOptions.length} of {options.length} option{options.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
