export interface Fragment {
  id: number;
  title: string;
  text: string;
  order: number;
  image_url?: string;
  is_final: boolean;
  story?: number;
}
