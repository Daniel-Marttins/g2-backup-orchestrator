
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Clock, 
  FolderOpen, 
  Play, 
  Square, 
  Settings,
  Activity,
  Server,
  AlertCircle,
  CheckCircle,
  Download,
  Trash2
} from 'lucide-react';
import { DatabaseConfig } from '@/components/DatabaseConfig';
import { ScheduleConfig } from '@/components/ScheduleConfig';
import { DestinationConfig } from '@/components/DestinationConfig';
import { ServiceControls } from '@/components/ServiceControls';
import { LogsViewer } from '@/components/LogsViewer';
import { useToast } from '@/hooks/use-toast';

interface AppConfig {
  databases: Array<{
    id: string;
    server: string;
    port: string;
    database: string;
    username: string;
    password: string;
  }>;
  schedules: Array<{
    id: string;
    time: string;
    days: string[];
  }>;
  destinations: Array<{
    id: string;
    path: string;
    compress: boolean;
  }>;
}

const Index = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AppConfig>({
    databases: [],
    schedules: [],
    destinations: []
  });
  const [serviceStatus, setServiceStatus] = useState('Parado');
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('g2-backup-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    // Simular status do serviço
    const savedStatus = localStorage.getItem('g2-service-status');
    if (savedStatus) {
      setServiceStatus(savedStatus);
    }
  }, []);

  // Salvar configurações
  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('g2-backup-config', JSON.stringify(newConfig));
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Executando':
        return 'bg-green-500';
      case 'Parado':
        return 'bg-red-500';
      case 'Instalando':
      case 'Parando':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Executando':
        return <CheckCircle className="h-4 w-4" />;
      case 'Parado':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">G2 Backup Manager</h1>
                <p className="text-gray-400 text-sm">Gerenciador de Backups SQL Server</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`${getStatusColor(serviceStatus)} text-white border-0`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(serviceStatus)}
                  <span>{serviceStatus}</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Bancos Cadastrados</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{config.databases.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Horários Agendados</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{config.schedules.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Destinos Configurados</CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{config.destinations.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Último Backup</CardTitle>
              <Download className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-white">
                {lastBackup || 'Nunca executado'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="databases" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                    <TabsTrigger value="databases" className="data-[state=active]:bg-blue-600">
                      Bancos de Dados
                    </TabsTrigger>
                    <TabsTrigger value="schedules" className="data-[state=active]:bg-blue-600">
                      Horários
                    </TabsTrigger>
                    <TabsTrigger value="destinations" className="data-[state=active]:bg-blue-600">
                      Destinos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="databases" className="mt-6">
                    <DatabaseConfig 
                      databases={config.databases}
                      onUpdate={(databases) => saveConfig({ ...config, databases })}
                    />
                  </TabsContent>

                  <TabsContent value="schedules" className="mt-6">
                    <ScheduleConfig 
                      schedules={config.schedules}
                      onUpdate={(schedules) => saveConfig({ ...config, schedules })}
                    />
                  </TabsContent>

                  <TabsContent value="destinations" className="mt-6">
                    <DestinationConfig 
                      destinations={config.destinations}
                      onUpdate={(destinations) => saveConfig({ ...config, destinations })}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Service Controls & Logs */}
          <div className="space-y-6">
            <ServiceControls 
              status={serviceStatus}
              onStatusChange={setServiceStatus}
            />
            <LogsViewer onLastBackupUpdate={setLastBackup} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
