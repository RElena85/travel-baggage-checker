export type ItemCategory =
  | 'higiene'
  | 'ropa-interior'
  | 'ropa-exterior'
  | 'calzado'
  | 'electronica'
  | 'documentos'
  | 'medicamentos'
  | 'accesorios'
  | 'entretenimiento'
  | 'otros';

export interface Item {
  id: string;
  name: string;
  isIn: boolean;
  isBack: boolean;
  category: ItemCategory;
  tag?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination?: string;
  departureDate?: string;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
