import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, UtensilsCrossed, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Reservation } from "@/types/casino";

interface MenuCalendarProps {
  reservations: Reservation[];
  onDateClick: (date: Date) => void;
  onReservationClick: (reservation: Reservation) => void;
  isMultiSelectMode?: boolean;
  selectedDates?: Date[];
  onToggleDateSelection?: (date: Date) => void;
}

export const MenuCalendar = ({ 
  reservations, 
  onDateClick, 
  onReservationClick,
  isMultiSelectMode = false,
  selectedDates = [],
  onToggleDateSelection
}: MenuCalendarProps) => {
  // Función para obtener el lunes de la semana actual
  const getMondayOfCurrentWeek = (date: Date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    return new Date(current.setDate(diff));
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfCurrentWeek(new Date()));
  
  const today = new Date();
  
  // Generar exactamente 28 días (4 semanas) empezando desde currentWeekStart
  const days = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  // Efecto para actualizar automáticamente el calendario cada lunes
  useEffect(() => {
    const updateCalendar = () => {
      const now = new Date();
      const currentMondayOfWeek = getMondayOfCurrentWeek(now);
      
      // Solo actualizar si estamos en un lunes diferente al actual
      if (currentMondayOfWeek.toDateString() !== currentWeekStart.toDateString()) {
        setCurrentWeekStart(currentMondayOfWeek);
      }
    };

    // Verificar inmediatamente
    updateCalendar();

    // Verificar cada hora si cambió la semana
    const interval = setInterval(updateCalendar, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentWeekStart]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
  };

  const getReservationForDate = (date: Date) => {
    return reservations.find(r => 
      r.date.toDateString() === date.toDateString()
    );
  };

  const getMenuForDate = (date: Date) => {
    // Menú simulado para cada día basado en la fecha
    const dayOfWeek = date.getDay();
    const menus = [
      { normal: "Arroz con pollo", hypocaloric: "Ensalada de pollo a la plancha" },
      { normal: "Espaguetis a la boloñesa", hypocaloric: "Espaguetis integrales con verduras" },
      { normal: "Pescado al horno con papas", hypocaloric: "Pescado al vapor con brócoli" },
      { normal: "Pollo a la plancha con arroz", hypocaloric: "Pechuga de pollo con quinoa" },
      { normal: "Lentejas con chorizo", hypocaloric: "Lentejas con verduras" },
      { normal: "Paella valenciana", hypocaloric: "Paella de verduras light" },
      { normal: "Carne asada con puré", hypocaloric: "Carne magra con puré de coliflor" }
    ];
    return menus[dayOfWeek];
  };

  const isReservable = (date: Date) => {
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2; // Mínimo 48 horas de anticipación
  };

  // Función para formatear el rango de fechas para el header
  const getDateRangeString = () => {
    const startDate = new Date(currentWeekStart);
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 27);
    
    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startStr = startDate.toLocaleDateString('es-ES', formatOptions);
    const endStr = endDate.toLocaleDateString('es-ES', formatOptions);
    
    return `${startStr} - ${endStr}`;
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <Card className="w-full shadow-calendar">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {getDateRangeString()}
            </h2>
            {isMultiSelectMode && (
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona los días para tu reserva múltiple
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const reservation = getReservationForDate(date);
            const menuForDay = getMenuForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const canReserve = isReservable(date);
            const isPastDate = date < today && !isToday;
            const isSelected = isDateSelected(date);

            const dayContent = (
              <div
                className={cn(
                  "min-h-20 p-2 border border-border rounded-lg transition-all duration-200",
                  {
                    "bg-gradient-subtle": !reservation && !isSelected,
                    "bg-gradient-reserved text-reserved-foreground": reservation?.status === 'confirmed',
                    "bg-pending text-pending-foreground": reservation?.status === 'pending',
                    "ring-2 ring-primary": isToday || (isMultiSelectMode && isSelected),
                    "bg-primary text-primary-foreground": isMultiSelectMode && isSelected,
                    "opacity-50 cursor-not-allowed": isPastDate || (isMultiSelectMode && reservation) || (!canReserve && !reservation),
                    "cursor-pointer hover:shadow-card hover:scale-105": canReserve || reservation,
                    "cursor-not-allowed": (!canReserve && !reservation) || isPastDate,
                    "hover:bg-accent": canReserve && !reservation && !isMultiSelectMode,
                    "hover:bg-primary/80": isMultiSelectMode && canReserve && !reservation
                  }
                )}
                onClick={() => {
                  if (isMultiSelectMode && canReserve && !reservation) {
                    onToggleDateSelection?.(date);
                  } else if (reservation && !isMultiSelectMode) {
                    onReservationClick(reservation);
                  } else if (canReserve && !isMultiSelectMode) {
                    onDateClick(date);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">
                    {date.getDate()}
                  </span>
                  {reservation && (
                    <UtensilsCrossed className="h-3 w-3" />
                  )}
                </div>
                
                {reservation && (
                  <div className="mt-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs h-5"
                    >
                      {reservation.menuType === 'normal' ? 'Normal' : 'Hipocalórico'}
                    </Badge>
                  </div>
                )}
                
                {!reservation && canReserve && (
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Disponible</span>
                  </div>
                )}
              </div>
            );

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {dayContent}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">
                        {date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </h4>
                      {reservation && (
                        <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {reservation.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-3 w-3" />
                          <span className="font-medium">Menú Normal:</span>
                        </div>
                        <p className="pl-5 text-muted-foreground">{menuForDay.normal}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-3 w-3" />
                          <span className="font-medium">Menú Hipocalórico:</span>
                        </div>
                        <p className="pl-5 text-muted-foreground">{menuForDay.hypocaloric}</p>
                      </div>
                      
                      {!reservation && canReserve && (
                        <div className="mt-2 p-2 bg-primary/10 rounded text-xs text-primary">
                          Haz clic para reservar
                        </div>
                      )}
                      
                      {reservation && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                          Ya tienes reserva para este día
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};