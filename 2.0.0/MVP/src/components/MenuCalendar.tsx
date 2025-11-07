import { useState } from "react";
import { ChevronLeft, ChevronRight, UtensilsCrossed, Clock, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Reservation } from "@/types/casino";

interface MenuCalendarProps {
  reservations: Reservation[];
  onDateClick: (date: Date) => void;
  isMultiSelectMode?: boolean;
  selectedDates?: Date[];
  onToggleDateSelection?: (date: Date) => void;
  onSelectDateRange?: () => void;
}

export const MenuCalendar = ({ 
  reservations, 
  onDateClick, 
  isMultiSelectMode = false,
  selectedDates = [],
  onToggleDateSelection,
  onSelectDateRange
}: MenuCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startCalendar = new Date(startOfMonth);
  
  // Ajustar al lunes más cercano (día 1)
  const dayOfWeek = startOfMonth.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startCalendar.setDate(startCalendar.getDate() + daysToMonday);
  
  const days = [];
  const current = new Date(startCalendar);
  
  // Calcular semanas necesarias para cubrir el mes (solo días laborables)
  const weeksNeeded = Math.ceil((endOfMonth.getDate() - startOfMonth.getDate() + 1 + (startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1)) / 5);
  
  for (let i = 0; i < weeksNeeded * 7; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
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

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie"];

  return (
    <Card className="w-full shadow-calendar">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-5 gap-2">
          {days.filter(date => {
            // Solo mostrar lunes a viernes (1-5)
            const dayOfWeek = date.getDay();
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          }).map((date, index) => {
            const reservation = getReservationForDate(date);
            const menuForDay = getMenuForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === today.toDateString();
            const canReserve = isReservable(date) && isCurrentMonth;
            const isPastDate = date < today && !isToday;
            const isSelected = isDateSelected(date);

            const dayContent = (
              <div
                className={cn(
                  "min-h-20 p-2 border border-border rounded-lg transition-all duration-200",
                  {
                    "bg-muted/30": !isCurrentMonth,
                    "bg-gradient-subtle": isCurrentMonth && !reservation && !isSelected,
                    "bg-gradient-reserved text-reserved-foreground": reservation?.status === 'confirmed',
                    "bg-pending text-pending-foreground": reservation?.status === 'pending',
                    "ring-2 ring-primary": isToday || (isMultiSelectMode && isSelected),
                    "bg-primary text-primary-foreground": isMultiSelectMode && isSelected,
                    "opacity-50 cursor-not-allowed": isPastDate || (isMultiSelectMode && reservation) || (!canReserve && isCurrentMonth && !reservation),
                    "cursor-pointer hover:shadow-card hover:scale-105": canReserve || reservation,
                    "cursor-not-allowed": (!canReserve && isCurrentMonth && !reservation) || isPastDate,
                    "hover:bg-accent": canReserve && !reservation && !isMultiSelectMode,
                    "hover:bg-primary/80": isMultiSelectMode && canReserve && !reservation
                  }
                )}
                onClick={() => {
                  if (isMultiSelectMode && canReserve && !reservation) {
                    onToggleDateSelection?.(date);
                  } else if (canReserve && !isMultiSelectMode) {
                    onDateClick(date);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <span className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground"
                  )}>
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
              <TooltipProvider key={index}>
                <Tooltip>
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
                        
                        {reservation && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                            Ya tienes reserva para este día
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
};