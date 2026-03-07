import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface CSVExportButtonProps<T extends Record<string, any>> {
  data: T[];
  filename: string;
  columns?: Column<T>[];
  disabled?: boolean;
}

export function CSVExportButton<T extends Record<string, any>>({
  data,
  filename,
  columns,
  disabled,
}: CSVExportButtonProps<T>) {
  const handleExport = () => {
    if (!data.length) return;

    const headers = columns
      ? columns.map(col => col.label)
      : Object.keys(data[0]);

    const rows = data.map(row =>
      columns
        ? columns.map(col => String(row[col.key] ?? '')).join(';')
        : Object.values(row).map(v => String(v ?? '')).join(';')
    );

    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleExport} disabled={disabled || !data.length} className="gap-2">
      <Icon name="Download" size={14} />
      CSV
    </Button>
  );
}
