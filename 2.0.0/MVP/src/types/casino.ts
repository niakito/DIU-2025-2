export interface MenuItem {
  id: string;
  date: Date;
  normal: {
    appetizer: string;
    mainCourse: string;
    dessert: string;
    calories: number;
  };
  hypocaloric: {
    appetizer: string;
    mainCourse: string;
    dessert: string;
    calories: number;
  };
}

export interface Reservation {
  id: string;
  date: Date;
  menuType: 'normal' | 'hypocaloric';
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  modifiedAt?: Date;
}

export interface UserPreferences {
  defaultMenuType: 'normal' | 'hypocaloric';
  notifications: boolean;
  autoReserve: boolean;
}