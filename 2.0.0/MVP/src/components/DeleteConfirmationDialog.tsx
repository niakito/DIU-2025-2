import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isMultiple?: boolean;
  count?: number;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isMultiple = false,
  count = 1
}: DeleteConfirmationDialogProps) => {
  const defaultTitle = isMultiple 
    ? `Eliminar ${count} reservas`
    : "Eliminar reserva";
    
  const defaultDescription = isMultiple
    ? `¿Estás seguro de que deseas eliminar ${count} reservas? Esta acción no se puede deshacer.`
    : "¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {title || defaultTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};