export default function CarnetTable({ columns, data, sectionType }) {
  const renderCellContent = (item, column) => {
    if (column === 'fecha' && item[column]) {
      return new Date(item[column]).toLocaleDateString();
    }
    return item[column] || '';
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              {columns && columns.length > 0 && columns.map((column) => (
                <th key={column.key} className="text-left py-3 px-2 font-semibold text-gray-700">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id || `${sectionType}-${index}-${item.fecha}`} className="border-b border-gray-200">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-2 text-gray-600">
                      {renderCellContent(item, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8 px-2 text-center text-gray-500">
                  No hay registros aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}