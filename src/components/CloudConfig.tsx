
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Cloud, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloudConfiguration {
  id: string;
  clientName: string;
  document: string; // CPF ou CNPJ
  employeeName: string;
  employeePhone: string;
  backupWebhook: string;
  notificationWebhook: string;
  enabled: boolean;
}

interface CloudConfigProps {
  configurations: CloudConfiguration[];
  onUpdate: (configurations: CloudConfiguration[]) => void;
}

export const CloudConfig: React.FC<CloudConfigProps> = ({ configurations, onUpdate }) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CloudConfiguration>>({});

  const handleAdd = () => {
    const newConfig: CloudConfiguration = {
      id: Date.now().toString(),
      clientName: '',
      document: '',
      employeeName: '',
      employeePhone: '',
      backupWebhook: '',
      notificationWebhook: '',
      enabled: false
    };
    setEditingId(newConfig.id);
    setFormData(newConfig);
    onUpdate([...configurations, newConfig]);
  };

  const handleEdit = (config: CloudConfiguration) => {
    setEditingId(config.id);
    setFormData({ ...config });
  };

  const handleSave = () => {
    if (!formData.clientName || !formData.document || !formData.employeeName || 
        !formData.employeePhone || !formData.backupWebhook || !formData.notificationWebhook) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedConfigs = configurations.map(config =>
      config.id === editingId ? { ...config, ...formData } : config
    );
    onUpdate(updatedConfigs);
    setEditingId(null);
    setFormData({});
    
    toast({
      title: "Sucesso",
      description: "Configuração de backup em nuvem salva."
    });
  };

  const handleCancel = () => {
    if (formData.clientName === '' && formData.document === '') {
      // Remove the empty configuration
      const updatedConfigs = configurations.filter(config => config.id !== editingId);
      onUpdate(updatedConfigs);
    }
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    const updatedConfigs = configurations.filter(config => config.id !== id);
    onUpdate(updatedConfigs);
    toast({
      title: "Configuração removida",
      description: "A configuração de backup em nuvem foi removida."
    });
  };

  const handleToggleEnabled = (id: string) => {
    const updatedConfigs = configurations.map(config =>
      config.id === id ? { ...config, enabled: !config.enabled } : config
    );
    onUpdate(updatedConfigs);
  };

  const formatDocument = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF format: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ format: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatPhone = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Backup em Nuvem</h3>
        <Button onClick={handleAdd} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Configuração
        </Button>
      </div>

      {configurations.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma configuração de backup em nuvem cadastrada.</p>
            <p className="text-gray-500 text-sm mt-2">
              Clique em "Adicionar Configuração" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {configurations.map((config) => (
            <Card key={config.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-blue-400" />
                    <span>{config.clientName || 'Nova Configuração'}</span>
                    <Badge variant={config.enabled ? "default" : "outline"} className="ml-2">
                      {config.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={config.enabled}
                      onCheckedChange={() => handleToggleEnabled(config.id)}
                      disabled={editingId === config.id}
                    />
                    <Label className="text-gray-300 text-sm">Habilitado</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === config.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Nome do Cliente</Label>
                        <Input
                          placeholder="Nome do cliente"
                          value={formData.clientName || ''}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">CPF ou CNPJ</Label>
                        <Input
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                          value={formData.document || ''}
                          onChange={(e) => {
                            const formatted = formatDocument(e.target.value);
                            setFormData({ ...formData, document: formatted });
                          }}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Nome do Funcionário</Label>
                        <Input
                          placeholder="Nome do funcionário responsável"
                          value={formData.employeeName || ''}
                          onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Celular do Funcionário</Label>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={formData.employeePhone || ''}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            setFormData({ ...formData, employeePhone: formatted });
                          }}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Webhook de Backup</Label>
                        <Input
                          placeholder="https://example.com/webhook/backup"
                          value={formData.backupWebhook || ''}
                          onChange={(e) => setFormData({ ...formData, backupWebhook: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Webhook de Notificação</Label>
                        <Input
                          placeholder="https://example.com/webhook/notification"
                          value={formData.notificationWebhook || ''}
                          onChange={(e) => setFormData({ ...formData, notificationWebhook: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Cliente:</span>
                        <p className="text-white">{config.clientName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Documento:</span>
                        <p className="text-white">{config.document}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Funcionário:</span>
                        <p className="text-white">{config.employeeName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Celular:</span>
                        <p className="text-white">{config.employeePhone}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Webhook Backup:</span>
                        <p className="text-white text-xs break-all">{config.backupWebhook}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Webhook Notificação:</span>
                        <p className="text-white text-xs break-all">{config.notificationWebhook}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => handleEdit(config)} variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button onClick={() => handleDelete(config.id)} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
