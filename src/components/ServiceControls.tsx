
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Settings, Trash2, Download, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceControlsProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export const ServiceControls: React.FC<ServiceControlsProps> = ({ status, onStatusChange }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceAction = async (action: string) => {
    setIsLoading(true);
    
    // Simular operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (action) {
      case 'install':
        onStatusChange('Parado');
        localStorage.setItem('g2-service-status', 'Parado');
        toast({
          title: "Serviço Instalado",
          description: "O serviço G2 Backup foi instalado com sucesso."
        });
        break;
        
      case 'start':
        onStatusChange('Executando');
        localStorage.setItem('g2-service-status', 'Executando');
        toast({
          title: "Serviço Iniciado",
          description: "O serviço G2 Backup está executando."
        });
        break;
        
      case 'stop':
        onStatusChange('Parado');
        localStorage.setItem('g2-service-status', 'Parado');
        toast({
          title: "Serviço Parado",
          description: "O serviço G2 Backup foi parado."
        });
        break;
        
      case 'uninstall':
        onStatusChange('Não Instalado');
        localStorage.setItem('g2-service-status', 'Não Instalado');
        toast({
          title: "Serviço Removido",
          description: "O serviço G2 Backup foi desinstalado."
        });
        break;
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Executando':
        return 'bg-green-500';
      case 'Parado':
        return 'bg-red-500';
      case 'Não Instalado':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Executando':
        return <CheckCircle className="h-4 w-4" />;
      case 'Parado':
        return <Square className="h-4 w-4" />;
      case 'Não Instalado':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Controle do Serviço</span>
          </span>
          <Badge variant="outline" className={`${getStatusColor(status)} text-white border-0`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span>{status}</span>
            </div>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'Não Instalado' || !status ? (
          <Button
            onClick={() => handleServiceAction('install')}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? 'Instalando...' : 'Instalar Serviço'}
          </Button>
        ) : (
          <div className="space-y-2">
            {status === 'Parado' ? (
              <Button
                onClick={() => handleServiceAction('start')}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? 'Iniciando...' : 'Iniciar Serviço'}
              </Button>
            ) : (
              <Button
                onClick={() => handleServiceAction('stop')}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                {isLoading ? 'Parando...' : 'Parar Serviço'}
              </Button>
            )}
            
            <Button
              onClick={() => handleServiceAction('uninstall')}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Removendo...' : 'Remover Serviço'}
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400 space-y-1">
            <p><strong>Nome:</strong> G2BackupService</p>
            <p><strong>Descrição:</strong> Serviço de backup automático SQL Server</p>
            <p><strong>Modo:</strong> Serviço do Windows</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
