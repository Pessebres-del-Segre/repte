export interface Store {
  id: number;
  name: string;
  description?: string;
  isUnlocked: boolean;
  qrCode?: string;
  location?: string;
}
