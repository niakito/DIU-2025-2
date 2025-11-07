import { useState } from "react";
import { Camera, Save, User, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  view?: 'profile' | 'preferences' | 'menu';
}

export const UserProfile = ({ isOpen, onClose, view = 'profile' }: UserProfileProps) => {
  const { user, updateUser, updatePreferences } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    defaultMenuType: user.preferences.defaultMenuType,
    notifications: user.preferences.notifications,
    autoReserve: user.preferences.autoReserve,
  });

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    });

    updatePreferences({
      defaultMenuType: formData.defaultMenuType,
      notifications: formData.notifications,
      autoReserve: formData.autoReserve,
    });

    toast({
      title: "✅ Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente.",
    });

    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            {view === 'preferences' ? <Save className="mr-2 h-5 w-5" /> :
             view === 'menu' ? <Menu className="mr-2 h-5 w-5" /> :
             <User className="mr-2 h-5 w-5" />}
            {view === 'preferences' ? 'Preferencias de Menú' : view === 'menu' ? 'Información del Menú' : 'Mi Perfil'}
          </DialogTitle>
          <DialogDescription>
            {view === 'preferences' 
              ? 'Configura tus preferencias predeterminadas'
              : view === 'menu' 
              ? 'Información sobre los tipos de menú disponibles'
              : 'Administra tu información personal y preferencias'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {view === 'menu' ? (
            /* Menu Information View */
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tipos de Menú Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-medium text-primary mb-2">Menú Normal</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Menú completo balanceado con todos los grupos alimenticios
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Proteína: Carnes, pollo, pescado</li>
                      <li>• Carbohidratos: Arroz, pasta, papa</li>
                      <li>• Vegetales y ensaladas</li>
                      <li>• Postre incluido</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-medium text-primary mb-2">Menú Hipocalórico</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Opción reducida en calorías para quienes buscan cuidar su alimentación
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Proteína magra: Pollo, pescado, legumbres</li>
                      <li>• Carbohidratos integrales en porciones controladas</li>
                      <li>• Abundantes vegetales y ensaladas</li>
                      <li>• Fruta fresca de postre</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : view === 'preferences' ? (
            /* Preferences Only View */
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferencias de Menú</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Menú Predeterminado</Label>
                  <RadioGroup
                    value={formData.defaultMenuType}
                    onValueChange={(value: 'normal' | 'hypocaloric') => 
                      setFormData(prev => ({ ...prev, defaultMenuType: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="default-normal" />
                      <Label htmlFor="default-normal" className="text-sm">Menú Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hypocaloric" id="default-hypocaloric" />
                      <Label htmlFor="default-hypocaloric" className="text-sm">Menú Hipocalórico</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    Esta opción se seleccionará automáticamente al hacer nuevas reservas
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Notificaciones
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Recibir recordatorios de reservas
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formData.notifications}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="autoReserve" className="text-sm font-medium">
                      Reserva Automática
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reservar automáticamente semanalmente
                    </p>
                  </div>
                  <Switch
                    id="autoReserve"
                    checked={formData.autoReserve}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, autoReserve: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Full Profile View */
            <>
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => {
                      toast({
                        title: "Cambiar foto",
                        description: "Función próximamente disponible",
                      });
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Institucional</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preferencias de Menú</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Menú Predeterminado</Label>
                    <RadioGroup
                      value={formData.defaultMenuType}
                      onValueChange={(value: 'normal' | 'hypocaloric') => 
                        setFormData(prev => ({ ...prev, defaultMenuType: value }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="default-normal" />
                        <Label htmlFor="default-normal" className="text-sm">Menú Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hypocaloric" id="default-hypocaloric" />
                        <Label htmlFor="default-hypocaloric" className="text-sm">Menú Hipocalórico</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Esta opción se seleccionará automáticamente al hacer nuevas reservas
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="notifications" className="text-sm font-medium">
                        Notificaciones
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recibir recordatorios de reservas
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={formData.notifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="autoReserve" className="text-sm font-medium">
                        Reserva Automática
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Reservar automáticamente semanalmente
                      </p>
                    </div>
                    <Switch
                      id="autoReserve"
                      checked={formData.autoReserve}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, autoReserve: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Actions */}
          {view !== 'menu' && (
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                {view === 'preferences' ? 'Cerrar' : 'Cancelar'}
              </Button>
              {view !== 'preferences' && (
                <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              )}
              {view === 'preferences' && (
                <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Preferencias
                </Button>
              )}
            </div>
          )}
          {view === 'menu' && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};