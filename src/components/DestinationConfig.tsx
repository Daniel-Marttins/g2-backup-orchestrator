
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FolderOpen, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DestinationItem {
  id: string;
  path: string;
  compress: boolean;
}

interface DestinationConfigProps {
  destinations: DestinationItem[];
  onUpdate: (destinations: DestinationItem[]) => void;
}

export const DestinationConfig: React.FC<DestinationConfigProps> = ({ destinations, onUpdate }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    path: '',
    compress: false
  });

  const resetForm = () => {
    setFormData({
      path: '',
      compress: false
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.path) {
      toast({
        title: "Erro",
        description: "Informe o caminho de destino.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar existente
      const updated = destinations.map(dest => 
        dest.id === editingId ? { ...formData, id: editingId } : dest
      );
      onUpdate(updated);
      toast({
        title: "Destino atualizado",
        description: "O destino foi atualizado com sucesso."
      });
    } else {
      // Adicionar novo
      const newDestination: DestinationItem = {
        ...formData,
        id: Date.now().toString()
      };
      onUpdate([...destinations, newDestination]);
      toast({
        title: "Destino adicionado",
        description: "Novo destino foi configurado."
      });
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (destination: DestinationItem) => {
    setFormData({
      path: destination.path,
      compress: destination.compress
    });
    setEditingId(destination.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(destinations.filter(dest => dest.id !== id));
    toast({
      title: "Destino removido",
      description: "Destino foi removido da configuração."
    });
  };

  const handleBrowse = () => {
    // Em uma aplicação Electron real, isso abriria um dialog de seleção de pasta
    toast({
      title: "Funcionalidade não disponível",
      description: "Em uma aplicação Electron, isso abriria o seletor de pastas.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Destinos dos Backups</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Destino
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingId ? 'Editar Destino' : 'Novo Destino'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="path" className="text-gray-300">Caminho do Destino *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="path"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="C:\Backups\"
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowse}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Buscar
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compress"
                  checked={formData.compress}
                  onCheckedChange={(checked) => setFormData({ ...formData, compress: checked as boolean })}
                />
                <Label htmlFor="compress" className="text-gray-300">
                  Comprimir backups (.rar)
                </Label>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 flex-1">
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
        {destinations.length === 0 ? (
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum destino configurado</p>
              <p className="text-sm text-gray-500 mt-1">
                Adicione destinos para salvar os backups
              </p>
            </CardContent>
          </Card>
        ) : (
          destinations.map((destination) => (
            <Card key={destination.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      {destination.compress ? (
                        <Archive className="h-4 w-4 text-purple-400" />
                      ) : (
                        <FolderOpen className="h-4 w-4 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{destination.path}</h4>
                      <p className="text-sm text-gray-400">
                        {destination.compress ? 'Compressão habilitada (.rar)' : 'Arquivos .bak'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(destination)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(destination.id)}
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
