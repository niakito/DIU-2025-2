import { useState } from "react";
import { Trash2, Edit, UtensilsCrossed, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Reservation } from "@/types/casino";

interface ReservationSidebarProps {
  reservations: Reservation[];
  onNewReservation: () => void;
  onEditReservation: (reservation: Reservation) => void;
  onDeleteReservation: (reservationId: string) => void;
  onDeleteMultiple: (reservationIds: string[]) => void;
}

export const ReservationSidebar = ({ 
  reservations, 
  onNewReservation, 
  onEditReservation, 
  onDeleteReservation,
  onDeleteMultiple
}: ReservationSidebarProps) => {
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);

  const upcomingReservations = reservations
    .filter(r => r.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastReservations = reservations
    .filter(r => r.date < new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Mostrar solo las últimas 5

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-reserved text-reserved-foreground';
      case 'pending':
        return 'bg-pending text-pending-foreground';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const toggleReservationSelection = (id: string) => {
    setSelectedReservations(prev => 
      prev.includes(id) 
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
    );
  };

  const deleteSelectedReservations = () => {
    onDeleteMultiple(selectedReservations);
    setSelectedReservations([]);
  };

  const toggleSelectAll = () => {
    if (selectedReservations.length === upcomingReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(upcomingReservations.map(r => r.id));
    }
  };

  const isAllSelected = selectedReservations.length === upcomingReservations.length && upcomingReservations.length > 0;

  return (
    <Card className="w-80 h-fit shadow-elegant">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <UtensilsCrossed className="mr-2 h-5 w-5" />
          Mis Reservas
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected reservations actions */}
        {selectedReservations.length > 0 && (
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-accent-foreground mb-2">
              {selectedReservations.length} reserva(s) seleccionada(s)
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={deleteSelectedReservations}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Eliminar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedReservations([])}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Upcoming reservations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Próximas Reservas
            </h3>
            {upcomingReservations.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <label htmlFor="select-all" className="text-xs text-muted-foreground cursor-pointer">
                  {isAllSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </label>
              </div>
            )}
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {upcomingReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tienes reservas próximas
                </p>
              ) : (
                upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                      "hover:shadow-card hover:scale-[1.02]",
                      selectedReservations.includes(reservation.id) 
                        ? "ring-2 ring-primary bg-accent" 
                        : "bg-card"
                    )}
                    onClick={() => toggleReservationSelection(reservation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{formatDate(reservation.date)}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {reservation.menuType}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={cn("text-xs", getStatusColor(reservation.status))}>
                          {reservation.status === 'confirmed' ? 'Confirmada' : 
                           reservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditReservation(reservation);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteReservation(reservation.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Recent past reservations */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Historial Reciente</h3>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {pastReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-2 rounded border bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatDate(reservation.date)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {reservation.menuType}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reservation.status === 'confirmed' ? 'Completada' : 'Cancelada'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};