import { useState, useEffect } from "react";
import { Check, Clock, Calendar } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MenuItem } from "@/types/casino";

interface MultiDayReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: Date[];
  onReserveMultiple: (dates: Date[], menuType: 'normal' | 'hypocaloric') => void;
}

export const MultiDayReservationModal = ({ 
  isOpen, 
  onClose, 
  selectedDates,
  onReserveMultiple
}: MultiDayReservationModalProps) => {
  const { user } = useUser();
  const [selectedMenuType, setSelectedMenuType] = useState<'normal' | 'hypocaloric'>('normal');

  // Auto-llenar con la preferencia del usuario al abrir el modal
  useEffect(() => {
    if (isOpen && user.preferences.defaultMenuType) {
      setSelectedMenuType(user.preferences.defaultMenuType);
    }
  }, [isOpen, user.preferences.defaultMenuType]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

const handleReserve = () => {
    onReserveMultiple(selectedDates, selectedMenuType);
    onClose();
  };

  if (selectedDates.length === 0) return null;

    const firstDate = selectedDates[0];
    const lastDate = selectedDates[selectedDates.length - 1];

    // Mock menu data - En una app real esto vendría de una API  
    const mockMenu: MenuItem = {
      id: `menu-${firstDate.toISOString()}`,
      date: firstDate,
    normal: {
      appetizer: "Ensalada mixta con vinagreta",
      mainCourse: "Pollo a la plancha con arroz pilaf",
      dessert: "Flan de vainilla",
      calories: 650
    },
    hypocaloric: {
      appetizer: "Ensalada verde con limón",
      mainCourse: "Pescado al vapor con verduras",
      dessert: "Yogurt con frutas",
      calories: 420
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <Calendar className="mr-2 h-5 w-5" />
            Reservar Múltiples Días
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedDates.length} días seleccionados</span>
                <Badge variant="secondary" className="text-xs">
                  {formatDate(firstDate).split(',')[0]} - {formatDate(lastDate).split(',')[0]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Todos los días seleccionados tendrán el mismo menú
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup 
            value={selectedMenuType} 
            onValueChange={(value) => setSelectedMenuType(value as 'normal' | 'hypocaloric')}
            className="space-y-4"
          >
            {/* Normal Menu Option */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              
              selectedMenuType === 'normal' 
                ? 'ring-2 ring-primary bg-gradient-subtle' 
                : 'hover:shadow-card'
            }`}
            onClick={() => setSelectedMenuType('normal')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer flex-1 pointer-events-none">
                    <CardTitle className="text-base flex items-center justify-between">
                      Menú Normal
                      <Badge variant="secondary" className="ml-2">
                        {mockMenu.normal.calories} cal
                      </Badge>
                    </CardTitle>
                  </Label>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Entrada:</span> {mockMenu.normal.appetizer}
                  </div>
                  <div>
                    <span className="font-medium">Plato Principal:</span> {mockMenu.normal.mainCourse}
                  </div>
                  <div>
                    <span className="font-medium">Postre:</span> {mockMenu.normal.dessert}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hypocaloric Menu Option */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedMenuType === 'hypocaloric' 
                ? 'ring-2 ring-primary bg-gradient-subtle' 
                : 'hover:shadow-card'
            }`}
            onClick={() => setSelectedMenuType('hypocaloric')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypocaloric" id="hypocaloric" />
                  <Label htmlFor="hypocaloric" className="cursor-pointer flex-1 pointer-events-none">
                    <CardTitle className="text-base flex items-center justify-between">
                      Menú Hipocalórico
                      <Badge variant="secondary" className="ml-2 bg-secondary text-secondary-foreground">
                        {mockMenu.hypocaloric.calories} cal
                      </Badge>
                    </CardTitle>
                  </Label>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Entrada:</span> {mockMenu.hypocaloric.appetizer}
                  </div>
                  <div>
                    <span className="font-medium">Plato Principal:</span> {mockMenu.hypocaloric.mainCourse}
                  </div>
                  <div>
                    <span className="font-medium">Postre:</span> {mockMenu.hypocaloric.dessert}
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>

          <Separator />

          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-accent p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>
              Recuerda: Las reservas deben hacerse con al menos 48 horas de anticipación
            </span>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleReserve} className="flex-1 bg-gradient-primary hover:bg-primary-light">
              <Check className="mr-2 h-4 w-4" />
              Confirmar {selectedDates.length} Reservas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};