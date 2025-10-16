import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table'
import { Badge } from '../../ui/badge'

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T>({ columns, data, emptyMessage = 'No data available' }: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor]
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10">
            {columns.map((column, i) => (
              <TableHead key={i} className="text-white">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-white/5">
                {columns.map((column, colIndex) => {
                  const value = getCellValue(row, column)
                  return (
                    <TableCell key={colIndex} className="text-white">
                      {column.render ? column.render(value, row) : (value as React.ReactNode)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-white/60 py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Helper component for percentage badge
export const PercentageBadge: React.FC<{ value: number; goodThreshold?: number; warningThreshold?: number }> = ({
  value,
  goodThreshold = 30,
  warningThreshold = 15,
}) => {
  const variant = value >= goodThreshold ? 'success' : value >= warningThreshold ? 'warning' : 'default'
  return <Badge variant={variant}>{value.toFixed(1)}%</Badge>
}

// Helper component for yes/no badge
export const BooleanBadge: React.FC<{ value: boolean }> = ({ value }) => {
  return <Badge variant={value ? 'success' : 'default'}>{value ? 'Yes' : 'No'}</Badge>
}
