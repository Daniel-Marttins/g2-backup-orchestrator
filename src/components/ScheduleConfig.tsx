
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleItem {
  id: string;
  time: string;
  days: string[];
}

interface ScheduleConfigProps {
  schedules: ScheduleItem[];
  onUpdate: (schedules: ScheduleItem[]) => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

export const ScheduleConfig: React.FC<ScheduleConfigProps> = ({ schedules, onUpdate }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    time: '',
    days: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      time: '',
      days: []
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.time || formData.days.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um horário e pelo menos um dia da semana.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar existente
      const updated = schedules.map(schedule => 
        schedule.id === editingId ? { ...formData, id: editingId } : schedule
      );
      onUpdate(updated);
      toast({
        title: "Horário atualizado",
        description: "O agendamento foi atualizado com sucesso."
      });
    } else {
      // Adicionar novo
      const newSchedule: ScheduleItem = {
        ...formData,
        id: Date.now().toString()
      };
      onUpdate([...schedules, newSchedule]);
      toast({
        title: "Horário adicionado",
        description: "Novo agendamento foi configurado."
      });
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (schedule: ScheduleItem) => {
    setFormData({
      time: schedule.time,
      days: schedule.days
    });
    setEditingId(schedule.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: "Horário removido",
      description: "Agendamento foi removido da configuração."
    });
  };

  const handleDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, days: [...formData.days, dayId] });
    } else {
      setFormData({ ...formData, days: formData.days.filter(d => d !== dayId) });
    }
  };

  const getDaysText = (days: string[]) => {
    const dayLabels = days.map(day => 
      daysOfWeek.find(d => d.id === day)?.label || day
    );
    return dayLabels.join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Horários de Execução</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingId ? 'Editar Horário' : 'Novo Horário'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="time" className="text-gray-300">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300 mb-3 block">Dias da Semana *</Label>
                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.days.includes(day.id)}
                        onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                      />
                      <Label htmlFor={day.id} className="text-gray-300">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1">
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
        {schedules.length === 0 ? (
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum horário configurado</p>
              <p className="text-sm text-gray-500 mt-1">
                Adicione horários para agendar os backups
              </p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Clock className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{schedule.time}</h4>
                      <p className="text-sm text-gray-400">{getDaysText(schedule.days)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
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
