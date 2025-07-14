
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
}

interface LogsViewerProps {
  onLastBackupUpdate: (date: string) => void;
}

export const LogsViewer: React.FC<LogsViewerProps> = ({ onLastBackupUpdate }) => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simular logs em tempo real
  useEffect(() => {
    const generateLog = (): LogEntry => {
      const messages = [
        { level: 'INFO' as const, message: 'Iniciando processo de backup...' },
        { level: 'SUCCESS' as const, message: 'Backup da base "Vendas" concluído com sucesso' },
        { level: 'INFO' as const, message: 'Conectando ao servidor localhost\\SQLEXPRESS' },
        { level: 'SUCCESS' as const, message: 'Arquivo de backup salvo em C:\\Backups\\' },
        { level: 'WARNING' as const, message: 'Espaço em disco baixo no destino' },
        { level: 'ERROR' as const, message: 'Falha na conexão com o banco "Clientes"' },
        { level: 'INFO' as const, message: 'Comprimindo arquivo de backup...' },
        { level: 'SUCCESS' as const, message: 'Backup comprimido salvo como .rar' }
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      return {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('pt-BR'),
        level: randomMessage.level,
        message: randomMessage.message
      };
    };

    // Adicionar logs iniciais
    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000).toLocaleString('pt-BR'),
        level: 'SUCCESS',
        message: 'Serviço G2 Backup iniciado com sucesso'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1800000).toLocaleString('pt-BR'),
        level: 'INFO',
        message: 'Carregando configurações de backup...'
      }
    ];
    
    setLogs(initialLogs);

    if (autoRefresh) {
      const interval = setInterval(() => {
        const newLog = generateLog();
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Manter apenas 50 logs
        
        // Atualizar último backup se for sucesso
        if (newLog.level === 'SUCCESS' && newLog.message.includes('concluído')) {
          onLastBackupUpdate(newLog.timestamp);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, onLastBackupUpdate]);

  const handleClearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs limpos",
      description: "Todos os logs foram removidos."
    });
  };

  const handleExportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level}: ${log.message}`
    ).join('\n');
    
    // Em uma aplicação real, isso salvaria o arquivo
    console.log('Exportando logs:', logText);
    toast({
      title: "Logs exportados",
      description: "Logs foram salvos em arquivo de texto."
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'bg-green-600';
      case 'WARNING':
        return 'bg-yellow-600';
      case 'ERROR':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Logs de Execução</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${
                autoRefresh ? 'bg-green-600/20 border-green-600' : ''
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogs}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearLogs}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full">
          {logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum log disponível</p>
              <p className="text-sm text-gray-500 mt-1">
                Os logs aparecerão aqui quando o serviço estiver executando
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <Badge 
                    variant="outline" 
                    className={`${getLevelColor(log.level)} text-white border-0 text-xs`}
                  >
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white break-words">{log.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{logs.length} logs carregados</span>
            <span className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{autoRefresh ? 'Atualizando automaticamente' : 'Pausado'}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
