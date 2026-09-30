import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showTotalInfo?: boolean;
    itemLabel?: string;
    variant?: 'default' | 'compact' | 'minimal';
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage: controlledPage,
    totalPages: controlledTotalPages,
    totalItems,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelector = false,
    showTotalInfo = true,
    itemLabel = 'records',
    variant = 'default',
    className = ''
}) => {
    const [internalPage, setInternalPage] = useState(1);
    const currentPage = controlledPage ?? internalPage;

    const totalPages = Math.max(
        1,
        controlledTotalPages ?? (totalItems !== undefined ? Math.ceil(totalItems / pageSize) : 48)
    );

    const handlePageChange = (page: number) => {
        const targetPage = Math.max(1, Math.min(totalPages, page));
        if (controlledPage === undefined) {
            setInternalPage(targetPage);
        }
        onPageChange?.(targetPage);
    };

    // Generate page numbers with smart ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        // const maxVisible = 5;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('ellipsis-start');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis-end');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = totalItems
        ? Math.min((currentPage - 1) * pageSize + 1, totalItems)
        : (currentPage - 1) * pageSize + 1;
    const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

    if (variant === 'minimal') {
        return (
            <div
                className={`flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400 ${className}`.trim()}>
                <span>
                    Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Previous page">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Next page">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`px-4 sm:px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/70 bg-slate-50/40 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 ${className}`.trim()}>
            {/* Left: Info or Page Size */}
            <div className="flex items-center gap-4 order-2 sm:order-1">
                {showTotalInfo && (
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        {totalItems !== undefined ? (
                            <>
                                Showing{' '}
                                <strong className="font-bold text-slate-700 dark:text-slate-200">{startItem}</strong> to{' '}
                                <strong className="font-bold text-slate-700 dark:text-slate-200">{endItem}</strong> of{' '}
                                <strong className="font-bold text-slate-900 dark:text-white">{totalItems}</strong>{' '}
                                {itemLabel}
                            </>
                        ) : (
                            <>
                                Showing Page{' '}
                                <strong className="font-bold text-slate-700 dark:text-slate-200">{currentPage}</strong>{' '}
                                of <strong className="font-bold text-slate-900 dark:text-white">{totalPages}</strong>{' '}
                                Pages
                            </>
                        )}
                    </span>
                )}

                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Rows:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Page Navigation Controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* First Page button (desktop) */}
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(1)}
                    className="hidden md:flex items-center justify-center p-1.5 h-8 w-8 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="First page">
                    <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                {/* Previous button */}
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers().map((pageItem, idx) => {
                        if (typeof pageItem === 'string') {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-7 h-8 flex items-center justify-center text-slate-400 select-none">
                                    •••
                                </span>
                            );
                        }

                        const isActive = pageItem === currentPage;
                        return (
                            <button
                                key={`page-${pageItem}`}
                                type="button"
                                onClick={() => handlePageChange(pageItem)}
                                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/25 ring-1 ring-emerald-500'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}>
                                {pageItem}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition cursor-pointer">
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Last Page button (desktop) */}
                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="hidden md:flex items-center justify-center p-1.5 h-8 w-8 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Last page">
                    <ChevronsRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
