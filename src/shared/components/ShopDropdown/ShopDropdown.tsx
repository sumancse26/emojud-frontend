import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Store, ChevronDown, Loader2, Search, Check, MapPin } from 'lucide-react';
import { useShop } from '@/app/modules/configurations/hooks/useShop';
import type { ShopItem } from '@/app/modules/configurations/types/shop.types';

export interface ShopDropdownProps {
    /** Currently selected shop ID */
    value?: string | number;
    /** Callback triggered when a shop is selected */
    onChange?: (shopId: string, shop?: ShopItem) => void;
    /** Optional pre-fetched list of shops. If not provided, fetches from /api/shop */
    shops?: ShopItem[];
    /** Custom loading override */
    isLoading?: boolean;
    /** Placeholder option text */
    placeholder?: string;
    /** Top label text */
    label?: string;
    /** Whether to show top label */
    showLabel?: boolean;
    /** Whether to include an "All Branches/Shops" option */
    allowAll?: boolean;
    /** Label for the "All" option */
    allLabel?: string;
    /** Value for the "All" option */
    allValue?: string;
    /** Visual style variant */
    variant?: 'default' | 'sidebar' | 'compact' | 'pill';
    /** Disabled state */
    disabled?: boolean;
    /** Additional wrapper CSS class */
    className?: string;
    /** Automatically select first available shop if none is selected */
    autoSelectFirst?: boolean;
}

export const ShopDropdown: React.FC<ShopDropdownProps> = ({
    value,
    onChange,
    shops: externalShops,
    isLoading: externalIsLoading,
    placeholder = 'Select Store Branch...',
    label = 'Active Store Branch',
    showLabel = false,
    allowAll = false,
    allLabel = 'All Branches / Outlets',
    allValue = 'all',
    variant = 'default',
    disabled = false,
    className = '',
    autoSelectFirst = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Fetch shops internally if not supplied externally
    const shouldFetch = !externalShops;
    const { shops: fetchedShops, isLoading: internalIsLoading } = useShop({
        immediate: shouldFetch
    });

    const shops = externalShops ?? fetchedShops;
    const loading = externalIsLoading ?? (shouldFetch && internalIsLoading);

    // Auto-select first shop if value is empty and autoSelectFirst is true
    useEffect(() => {
        if (autoSelectFirst && !value && shops.length > 0 && onChange) {
            onChange(String(shops[0].id), shops[0]);
        }
    }, [autoSelectFirst, value, shops, onChange]);

    // Filter shops by search query
    const filteredShops = useMemo(() => {
        if (!searchQuery.trim()) return shops;
        const q = searchQuery.toLowerCase();
        return shops.filter(
            (s) =>
                s.shop_name.toLowerCase().includes(q) ||
                s.short_code?.toLowerCase().includes(q) ||
                s.display_code?.toLowerCase().includes(q) ||
                s.address?.toLowerCase().includes(q)
        );
    }, [shops, searchQuery]);

    // Find selected shop object
    const selectedShop = useMemo(
        () => shops.find((s) => String(s.id) === String(value)),
        [shops, value]
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-shop-option]');
            items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    const handleToggle = useCallback(() => {
        if (disabled || loading) return;
        setIsOpen((prev) => {
            if (!prev) {
                setSearchQuery('');
                setHighlightedIndex(-1);
            }
            return !prev;
        });
    }, [disabled, loading]);

    const handleSelect = useCallback(
        (shopId: string, shop?: ShopItem) => {
            onChange?.(shopId, shop);
            setIsOpen(false);
            setSearchQuery('');
            setHighlightedIndex(-1);
        },
        [onChange]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const totalItems = (allowAll ? 1 : 0) + filteredShops.length;
            if (!isOpen) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    handleToggle();
                }
                return;
            }
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (highlightedIndex >= 0) {
                        if (allowAll && highlightedIndex === 0) {
                            handleSelect(allValue);
                        } else {
                            const shopIndex = allowAll ? highlightedIndex - 1 : highlightedIndex;
                            const shop = filteredShops[shopIndex];
                            if (shop) handleSelect(String(shop.id), shop);
                        }
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
        [isOpen, highlightedIndex, filteredShops, allowAll, allValue, handleToggle, handleSelect]
    );

    // Display text for the selected value
    const displayText = useMemo(() => {
        if (value === allValue && allowAll) return allLabel;
        if (selectedShop) {
            const code = selectedShop.short_code || selectedShop.display_code;
            return code ? `${selectedShop.shop_name} (${code})` : selectedShop.shop_name;
        }
        return placeholder;
    }, [value, allValue, allowAll, allLabel, selectedShop, placeholder]);

    const isPlaceholder = !selectedShop && !(value === allValue && allowAll);

    // ─── Variant-based trigger styles ─────────────────────────────────
    const triggerStyles = useMemo(() => {
        const base =
            'w-full flex items-center gap-2 cursor-pointer transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';
        switch (variant) {
            case 'sidebar':
                return `${base} bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-2.5 py-2.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/30`;
            case 'compact':
                return `${base} bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5`;
            case 'pill':
                return `${base} bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500/30`;
            default:
                return `${base} bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500`;
        }
    }, [variant]);

    const iconSizeClass = variant === 'compact' || variant === 'pill' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const textSizeClass = variant === 'compact' || variant === 'pill' ? 'text-[11px]' : 'text-xs';

    return (
        <div ref={dropdownRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
            {/* Label */}
            {showLabel && (
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled || loading}
                className={`${triggerStyles} ${isOpen ? 'ring-2 ring-emerald-500/30 border-emerald-500/50 dark:border-emerald-500/40' : ''}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}>
                {/* Left Icon */}
                {loading ? (
                    <Loader2 className={`${iconSizeClass} text-slate-400 animate-spin shrink-0`} />
                ) : (
                    <Store
                        className={`${iconSizeClass} shrink-0 ${
                            variant === 'pill'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                    />
                )}

                {/* Display Text */}
                <span
                    className={`${textSizeClass} font-semibold truncate flex-1 text-left ${
                        isPlaceholder
                            ? 'text-slate-400 dark:text-slate-500'
                            : variant === 'pill'
                              ? 'text-emerald-800 dark:text-emerald-300'
                              : 'text-slate-800 dark:text-slate-100'
                    }`}>
                    {loading ? 'Loading branches...' : displayText}
                </span>

                {/* Chevron */}
                <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className={`absolute left-0 right-0 mt-1.5 z-[100] origin-top animate-in fade-in slide-in-from-top-1 duration-150
                        bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-700/60
                        rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/40
                        overflow-hidden`}
                    role="listbox">
                    {/* Search Bar */}
                    {shops.length > 3 && (
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
                                    placeholder="Search branches..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div ref={listRef} className="max-h-52 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                        {/* "All" option */}
                        {allowAll && (
                            <button
                                type="button"
                                data-shop-option
                                onClick={() => handleSelect(allValue)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors duration-100 cursor-pointer
                                    ${value === allValue ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}
                                    ${highlightedIndex === 0 ? 'bg-slate-100 dark:bg-slate-800/80' : ''}`}
                                role="option"
                                aria-selected={value === allValue}>
                                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="font-semibold flex-1 truncate">{allLabel}</span>
                                {value === allValue && (
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                )}
                            </button>
                        )}

                        {/* Shop options */}
                        {filteredShops.map((shop, idx) => {
                            const isSelected = String(value) === String(shop.id);
                            const itemIndex = allowAll ? idx + 1 : idx;
                            const isHighlighted = highlightedIndex === itemIndex;
                            const code = shop.short_code || shop.display_code;

                            return (
                                <button
                                    type="button"
                                    key={shop.id}
                                    data-shop-option
                                    onClick={() => handleSelect(String(shop.id), shop)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors duration-100 cursor-pointer
                                        ${isSelected ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''}
                                        ${isHighlighted && !isSelected ? 'bg-slate-100 dark:bg-slate-800/80' : ''}
                                        ${!isSelected && !isHighlighted ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''}`}
                                    role="option"
                                    aria-selected={isSelected}>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/15 flex items-center justify-center shrink-0">
                                        <MapPin
                                            className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`font-semibold truncate leading-tight ${
                                                isSelected
                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                    : 'text-slate-800 dark:text-slate-200'
                                            }`}>
                                            {shop.shop_name}
                                        </p>
                                        {(code || shop.address) && (
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                                                {code && <span className="font-medium">{code}</span>}
                                                {code && shop.address && <span> · </span>}
                                                {shop.address && <span>{shop.address}</span>}
                                            </p>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Empty state */}
                        {filteredShops.length === 0 && !loading && (
                            <div className="px-3 py-6 text-center">
                                <Store className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-600 mb-1.5" />
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    {searchQuery ? 'No branches found' : 'No branches available'}
                                </p>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div className="px-3 py-6 text-center">
                                <Loader2 className="w-5 h-5 mx-auto text-emerald-500 animate-spin mb-1.5" />
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Loading branches...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer count */}
                    {shops.length > 0 && (
                        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                {filteredShops.length} of {shops.length} branch{shops.length !== 1 ? 'es' : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopDropdown;
