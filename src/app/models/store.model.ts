export interface Store {
  uuid: string;
  id?: string; // For backward compatibility
  name: string;
  description?: string;
  isUnlocked?: boolean;
  location?: string;
  image?: string;
  secret_key?: string;
}


export interface StoreScanCollaboration {
  uuid: string;
  name: string;
  description?: string;
  lat?: number;
  lon?: number;
  special?: boolean;
  is_final?: boolean;
  contest_year?: number;
  is_scanned?: boolean;
}
