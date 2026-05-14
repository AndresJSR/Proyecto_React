import React from 'react';

export interface Action {
  name: string;
  label: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  accessor?: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface GenericTableProps<T extends object> {
  data: T[];
  columns: TableColumn<T>[];
  actions: Action[];
  onAction: (name: string, item: T) => void;
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[key];
  }, obj);
};

const formatValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
};

const GenericTable = <T extends object>({
  data,
  columns,
  actions,
  onAction,
}: GenericTableProps<T>) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`py-4 px-4 font-medium text-black dark:text-white ${
                    index === 0 ? 'min-w-[220px] xl:pl-11' : 'min-w-[150px]'
                  }`}
                >
                  {col.header}
                </th>
              ))}

              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => {
                  let content: React.ReactNode;

                  if (col.render) {
                    content = col.render(item);
                  } else if (col.accessor) {
                    const value = getNestedValue(item, String(col.accessor));
                    content = formatValue(value);
                  } else {
                    content = '—';
                  }

                  return (
                    <td
                      key={col.key}
                      className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${
                        colIndex === 0 ? 'pl-9 xl:pl-11' : ''
                      }`}
                    >
                      <div className="text-black dark:text-white">
                        {content}
                      </div>
                    </td>
                  );
                })}

                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.name}
                        onClick={() => onAction(action.name, item)}
                        type="button"
                        className={`rounded-md border border-stroke px-2 py-1 text-xs font-medium transition
                          hover:bg-gray-2 dark:border-strokedark
                          ${
                            action.name === 'delete'
                              ? 'text-red-500 hover:bg-red-100'
                              : ''
                          }
                          ${
                            action.name === 'edit'
                              ? 'text-blue-500 hover:bg-blue-100'
                              : ''
                          }
                          ${
                            action.name === 'view'
                              ? 'text-blue-500 hover:bg-blue-100'
                              : ''
                          }
                          ${
                            action.name === 'download'
                              ? 'text-green-500 hover:bg-green-100'
                              : ''
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-5 px-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
