import { useEffect, useMemo, useState } from 'react'

export interface TablePaginationState<T> {
  currentPage: number
  pageSize: number
  totalPages: number
  paginatedItems: T[]
  setCurrentPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}

export function useTablePagination<T>(items: T[], initialPageSize = 10): TablePaginationState<T> {
  const [currentPage, setCurrentPageState] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    setCurrentPageState((page) => Math.min(page, totalPages))
  }, [totalPages])

  const paginatedItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, items, pageSize],
  )

  const setCurrentPage = (page: number) => {
    setCurrentPageState(Math.max(1, Math.min(page, totalPages)))
  }

  const setPageSize = (nextPageSize: number) => {
    setPageSizeState(nextPageSize)
    setCurrentPageState(1)
  }

  return { currentPage, pageSize, totalPages, paginatedItems, setCurrentPage, setPageSize }
}

export default useTablePagination
