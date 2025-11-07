import { useState } from "react";
import { Header } from "@/components/Header";
import { MenuCalendar } from "@/components/MenuCalendar";
import { ReservationSidebar } from "@/components/ReservationSidebar";
import { MenuReservationModal } from "@/components/MenuReservationModal";
import { MultiDayReservationModal } from "@/components/MultiDayReservationModal";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { UserProvider } from "@/contexts/UserContext";
import { Reservation } from "@/types/casino";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, CalendarRange } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      date: new Date(2024, 11, 20), // 20 de diciembre
      menuType: "normal",
      status: "confirmed",
      createdAt: new Date(),
    },
    {
      id: "2", 
      date: new Date(2024, 11, 22), // 22 de diciembre
      menuType: "hypocaloric",
      status: "pending",
      createdAt: new Date(),
    },
    {
      id: "3",
      date: new Date(2024, 10, 15), // 15 de noviembre (pasada)
      menuType: "normal", 
      status: "confirmed",
      createdAt: new Date(),
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [editingReservation, setEditingReservation] = useState<{ id: string; date: Date; menuType: 'normal' | 'hypocaloric' } | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    reservationIds: string[];
    isMultiple: boolean;
  }>({
    isOpen: false,
    reservationIds: [],
    isMultiple: false
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleReservationClick = (reservation: Reservation) => {
      handleEditReservation(reservation);
    };

  const handleNewReservation = () => {
    // No permitir reservas para el día actual por la regla de 48h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // Mínimo 48 horas
    setSelectedDate(tomorrow);
    setIsModalOpen(true);
  };

  const handleMultipleReservation = () => {
    setIsMultiSelectMode(true);
    setSelectedDates([]);
  };

  const handleToggleDateSelection = (date: Date) => {
    setSelectedDates(prev => {
      const isSelected = prev.some(d => d.toDateString() === date.toDateString());
      if (isSelected) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleSelectDateRange = () => {
    if (selectedDates.length < 2) return;
    
    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    
    const dateRange: Date[] = [];
    const current = new Date(firstDate);
    
    while (current <= lastDate) {
      // Solo añadir días laborables (lunes a viernes)
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Verificar que no exista reserva para ese día
        const hasReservation = reservations.some(r => 
          r.date.toDateString() === current.toDateString()
        );
        if (!hasReservation) {
          dateRange.push(new Date(current));
        }
      }
      current.setDate(current.getDate() + 1);
    }
    
    setSelectedDates(dateRange);
  };

  const [isMultiDayModalOpen, setIsMultiDayModalOpen] = useState(false);

  const handleConfirmMultipleSelection = () => {
    if (selectedDates.length > 0) {
      setIsMultiSelectMode(false);
      setIsMultiDayModalOpen(true);
    } else {
      toast({
        title: "Selección requerida",
        description: "Debes seleccionar al menos un día para continuar.",
        variant: "destructive",
      });
    }
  };

  const handleCancelMultipleSelection = () => {
    setIsMultiSelectMode(false);
    setSelectedDates([]);
  };

  const handleReserve = (date: Date, menuType: 'normal' | 'hypocaloric') => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      date,
      menuType,
      status: "pending",
      createdAt: new Date(),
    };

    setReservations(prev => [...prev, newReservation]);
    
    toast({
      title: "¡Reserva realizada!",
      description: `Tu reserva para ${date.toLocaleDateString('es-ES')} ha sido confirmada.`,
      variant: "default",
    });
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation({
      id: reservation.id,
      date: reservation.date,
      menuType: reservation.menuType
    });
    setIsModalOpen(true);
  };

  const handleUpdateReservation = (reservationId: string, menuType: 'normal' | 'hypocaloric') => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId 
        ? { ...r, menuType, modifiedAt: new Date() }
        : r
    ));
    
    toast({
      title: "¡Reserva actualizada!",
      description: "Tu reserva ha sido modificada exitosamente.",
    });
  };

  const handleReserveMultiple = (dates: Date[], menuType: 'normal' | 'hypocaloric') => {
    const newReservations = dates.map(date => ({
      id: `${Date.now()}-${Math.random()}`,
      date,
      menuType,
      status: "pending" as const,
      createdAt: new Date(),
    }));

    setReservations(prev => [...prev, ...newReservations]);
    
    toast({
      title: "¡Reservas realizadas!",
      description: `Se han confirmado ${dates.length} reservas.`,
    });
  };

  const handleDeleteReservation = (reservationId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      reservationIds: [reservationId],
      isMultiple: false
    });
  };

  const handleDeleteMultipleReservations = (reservationIds: string[]) => {
    setDeleteConfirmation({
      isOpen: true,
      reservationIds,
      isMultiple: true
    });
  };

  const confirmDeleteReservation = () => {
    setReservations(prev => 
      prev.filter(r => !deleteConfirmation.reservationIds.includes(r.id))
    );
    
    const count = deleteConfirmation.reservationIds.length;
    toast({
      title: count > 1 ? "Reservas eliminadas" : "Reserva eliminada",
      description: count > 1 
        ? `Se han eliminado ${count} reservas exitosamente.`
        : "La reserva ha sido eliminada exitosamente.",
      variant: "destructive",
    });

    setDeleteConfirmation({
      isOpen: false,
      reservationIds: [],
      isMultiple: false
    });
  };

  const cancelDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      reservationIds: [],
      isMultiple: false
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingReservation(null);
  };

  const handleCloseMultiDayModal = () => {
    setIsMultiDayModalOpen(false);
    setSelectedDates([]);
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main content - Calendar */}
            <div className="flex-1">
              <div className={cn(
                "mb-6 transition-all duration-300",
                isMultiSelectMode && "blur-sm brightness-75"
              )}>
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Calendario de Menús
                </h1>
                <p className="text-muted-foreground">
                  Gestiona tus reservas de almuerzo con facilidad. 
                  Recuerda reservar con al menos 48 horas de anticipación.
                </p>
              </div>
              
              <div className={cn(
                "transition-all duration-300",
                isMultiSelectMode && "relative"
              )}>
                <MenuCalendar
                  reservations={reservations}
                  onDateClick={handleDateClick}
                  onReservationClick={handleReservationClick}
                  isMultiSelectMode={isMultiSelectMode}
                  selectedDates={selectedDates}
                  onToggleDateSelection={handleToggleDateSelection}
                  onSelectDateRange={handleSelectDateRange}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80">
              {/* Multi-day reservation button */}
              <div className={cn(
                "mb-4 transition-all duration-300",
                isMultiSelectMode && "blur-sm brightness-75 pointer-events-none"
              )}>
                <Button 
                  onClick={handleMultipleReservation}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center space-x-2 py-3"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Reservar días</span>
                </Button>
              </div>
              
              <div className={cn(
                "transition-all duration-300",
                isMultiSelectMode && "blur-sm brightness-75 pointer-events-none"
              )}>
                <ReservationSidebar
                  reservations={reservations}
                  onNewReservation={handleNewReservation}
                  onEditReservation={handleEditReservation}
                  onDeleteReservation={handleDeleteReservation}
                  onDeleteMultiple={handleDeleteMultipleReservations}
                />
              </div>
            </div>
          </div>

          {/* Multi-select overlay */}
          {isMultiSelectMode && (
            <>
              {/* Instructions overlay - positioned to not block calendar */}
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-elegant max-w-sm text-center">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Selección Múltiple
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Selecciona los días que deseas reservar en el calendario.
                </p>
                <p className="text-sm font-medium text-primary">
                  {selectedDates.length} día(s) seleccionado(s)
                </p>
              </div>

              {/* Action buttons */}
              <div className="fixed bottom-6 right-6 z-30 flex space-x-3">
                {selectedDates.length >= 2 && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={handleSelectDateRange}
                          className="bg-background/95 backdrop-blur-sm border-border hover:bg-accent gap-2"
                        >
                          <CalendarRange className="h-4 w-4" />
                          Seleccionar Rango
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Selecciona todos los días entre los dos días seleccionados</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleCancelMultipleSelection}
                  className="bg-background/95 backdrop-blur-sm border-border hover:bg-accent"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirmMultipleSelection}
                  disabled={selectedDates.length === 0}
                  className="bg-gradient-primary hover:bg-primary-light"
                >
                  Continuar ({selectedDates.length})
                </Button>
              </div>
            </>
          )}
        </main>

        <MenuReservationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          onReserve={handleReserve}
          editingReservation={editingReservation}
          onUpdateReservation={handleUpdateReservation}
          onDeleteReservation={handleDeleteReservation}
        />

        <MultiDayReservationModal
          isOpen={isMultiDayModalOpen}
          onClose={handleCloseMultiDayModal}
          selectedDates={selectedDates}
          onReserve={handleReserve}
          onReserveMultiple={handleReserveMultiple}
        />

        <DeleteConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={cancelDeleteConfirmation}
          onConfirm={confirmDeleteReservation}
          isMultiple={deleteConfirmation.isMultiple}
          count={deleteConfirmation.reservationIds.length}
        />
      </div>
    </UserProvider>
  );
};

export default Index;