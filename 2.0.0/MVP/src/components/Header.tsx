import { User, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/components/UserProfile";
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileView, setProfileView] = useState<'profile' | 'preferences' | 'menu'>('profile');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-card shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CU</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Casino Universidad</h1>
              <p className="text-sm text-muted-foreground">Sistema de Reservas</p>
            </div>
          </div>


          {/* User Profile */}
          <div className="flex items-center gap-4">
            {/* Quick Preferences Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setProfileView('preferences'); setIsProfileOpen(true); }}
              className="hidden md:flex items-center gap-2 bg-accent text-primary hover:bg-primary hover:text-accent border-primary/20"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">
                Preferencia de Menú: {user.preferences.defaultMenuType === 'normal' ? 'Normal' : 'Hipocalórico'}
              </span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto px-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-sm bg-gradient-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => { setProfileView('profile'); setIsProfileOpen(true); }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setProfileView('preferences'); setIsProfileOpen(true); }}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferencias de Menú</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setProfileView('menu'); setIsProfileOpen(true); }}>
                  <Menu className="mr-2 h-4 w-4" />
                  <span>Información del Menú</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        view={profileView}
      />
    </header>
  );
};