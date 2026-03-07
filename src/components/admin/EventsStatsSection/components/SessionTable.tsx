import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CSVExportButton } from './CSVExportButton';
import { SessionInfo } from '../types';
import { format } from 'date-fns';

interface SessionTableProps {
  data: SessionInfo[];
  isLoading: boolean;
  onRefresh: () => void;
  period: string;
}

export const SessionTable = ({ data, isLoading, onRefresh, period }: SessionTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const columns = [
    { key: 'session_id', label: 'ID сессии' },
    { key: 'visitor_uuid', label: 'Посетитель' },
    { key: 'started_at', label: 'Начало' },
    { key: 'last_event_at', label: 'Последнее событие' },
    { key: 'events_count', label: 'Событий' },
    { key: 'page_views', label: 'Просмотров' },
    { key: 'provider_clicks', label: 'Кликов' },
    { key: 'page_paths', label: 'Страницы' },
  ];

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd.MM.yyyy HH:mm:ss');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последние сессии</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onRefresh} disabled={isLoading}>
            <Icon name="RefreshCw" size={14} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <CSVExportButton
            data={data.map(s => ({
              ...s,
              started_at: formatDate(s.started_at),
              last_event_at: formatDate(s.last_event_at),
              page_paths: s.page_paths.join(', '),
            }))}
            filename={`sessions_${period}`}
            columns={columns}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !data.length && (
          <div className="flex justify-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Нет данных</p>
        )}
        {data.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Сессия</TableHead>
                  <TableHead>Посетитель</TableHead>
                  <TableHead>Начало</TableHead>
                  <TableHead>Последнее</TableHead>
                  <TableHead className="text-right">Событий</TableHead>
                  <TableHead className="text-right">Просмотров</TableHead>
                  <TableHead className="text-right">Кликов</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((session) => (
                  <>
                    <TableRow
                      key={session.session_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedRow(expandedRow === session.session_id ? null : session.session_id)}
                    >
                      <TableCell>
                        <Icon
                          name={expandedRow === session.session_id ? 'ChevronDown' : 'ChevronRight'}
                          size={16}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{session.session_id.slice(0, 8)}…</TableCell>
                      <TableCell className="font-mono text-xs">{session.visitor_uuid.slice(0, 8)}…</TableCell>
                      <TableCell>{formatDate(session.started_at)}</TableCell>
                      <TableCell>{formatDate(session.last_event_at)}</TableCell>
                      <TableCell className="text-right">{session.events_count}</TableCell>
                      <TableCell className="text-right">{session.page_views}</TableCell>
                      <TableCell className="text-right">{session.provider_clicks}</TableCell>
                    </TableRow>
                    {expandedRow === session.session_id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/30 p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold">Session ID:</span> {session.session_id}
                            </div>
                            <div>
                              <span className="font-semibold">Visitor UUID:</span> {session.visitor_uuid}
                            </div>
                            <div>
                              <span className="font-semibold">Посещённые страницы:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {session.page_paths.map((path) => (
                                  <Badge key={path} variant="outline">{path}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
