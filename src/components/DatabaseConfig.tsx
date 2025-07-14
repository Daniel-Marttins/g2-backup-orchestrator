
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Database, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DatabaseItem {
  id: string;
  server: string;
  database: string;
  username: string;
  password: string;
}

interface DatabaseConfigProps {
  databases: DatabaseItem[];
  onUpdate: (databases: DatabaseItem[]) => void;
}

export const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ databases, onUpdate }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    server: '',
    database: '',
    username: '',
    password: ''
  });

  const resetForm = () => {
    setFormData({
      server: '',
      database: '',
      username: '',
      password: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.server || !formData.database || !formData.username) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar existente
      const updated = databases.map(db => 
        db.id === editingId ? { ...formData, id: editingId } : db
      );
      onUpdate(updated);
      toast({
        title: "Banco atualizado",
        description: "As configurações do banco foram atualizadas."
      });
    } else {
      // Adicionar novo
      const newDatabase: DatabaseItem = {
        ...formData,
        id: Date.now().toString()
      };
      onUpdate([...databases, newDatabase]);
      toast({
        title: "Banco adicionado",
        description: "Novo banco de dados foi configurado."
      });
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (database: DatabaseItem) => {
    setFormData({
      server: database.server,
      database: database.database,
      username: database.username,
      password: database.password
    });
    setEditingId(database.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(databases.filter(db => db.id !== id));
    toast({
      title: "Banco removido",
      description: "Banco de dados foi removido da configuração."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Bancos de Dados</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Banco
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingId ? 'Editar Banco de Dados' : 'Novo Banco de Dados'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="server" className="text-gray-300">Servidor *</Label>
                <Input
                  id="server"
                  value={formData.server}
                  onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  placeholder="localhost\SQLEXPRESS"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="database" className="text-gray-300">Nome do Banco *</Label>
                <Input
                  id="database"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  placeholder="MinhaBaseDados"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="username" className="text-gray-300">Usuário *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="sa"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1">
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {databases.length === 0 ? (
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-6 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum banco de dados configurado</p>
              <p className="text-sm text-gray-500 mt-1">
                Adicione um banco para começar os backups
              </p>
            </CardContent>
          </Card>
        ) : (
          databases.map((database) => (
            <Card key={database.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Server className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{database.database}</h4>
                      <p className="text-sm text-gray-400">{database.server}</p>
                      <p className="text-xs text-gray-500">Usuário: {database.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(database)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(database.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
