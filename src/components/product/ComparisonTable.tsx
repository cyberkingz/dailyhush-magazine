import React from 'react';

interface ComparisonRow {
  feature: string;
  values: (string | boolean)[];
}

interface ComparisonTableProps {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
  highlightColumn?: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  columns,
  rows,
  highlightColumn = 0,
}) => {
  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? '✓' : '—';
    }
    return value;
  };

  return (
    <div className="p-8 md:p-10 mb-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 mb-8 text-center leading-[1.2]">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-emerald-200/40">
              <th className="text-left p-4 font-bold text-emerald-900"></th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-center p-4 font-bold ${
                    index === highlightColumn
                      ? 'text-emerald-900 bg-emerald-50/50'
                      : 'text-emerald-700/70'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-emerald-800/80">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex < rows.length - 1 ? 'border-b border-emerald-200/20' : ''}
              >
                <td className={`p-4 ${rowIndex === rows.length - 1 ? 'font-bold' : 'font-medium'}`}>
                  {row.feature}
                </td>
                {row.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={`text-center p-4 ${
                      colIndex === highlightColumn ? 'bg-emerald-50/30' : ''
                    } ${
                      rowIndex === rows.length - 1 && colIndex === highlightColumn
                        ? 'font-bold text-emerald-900'
                        : ''
                    }`}
                  >
                    {renderCell(value)}
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
