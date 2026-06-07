// types/menu.ts

export interface IChef {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  speciality?: string;
  rating: number | string;
  status: string;
  image?: string;
}

export interface IMenu {
  _id: string;
  title: string;
  price: number;
  stock: number;
  description?: string;
  image?: { url: string; public_id: string };
  categoryId: {
    _id: string;
    name: string;
  };
  chefId?: string;
}


export interface ICategory {
  _id: string;
  name: string;
  description?: string;
}