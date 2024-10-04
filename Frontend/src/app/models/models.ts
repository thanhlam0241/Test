export interface User {
  id: number;
  email: string;
  name: string;
  mobileNumber: string;
  is_staff: boolean;
  date_joined: string;
  address: string;
}

export interface ResultLogin {
  access: string;
  refresh: string;
}

export enum AccountStatus {
  UNAPROOVED,
  ACTIVE,
  BLOCKED,
}

export enum UserType {
  ADMIN,
  USER,
}

export interface BookCategory {
  id: number;
  name: string;
}

export interface BookCategoryInsertDto {
  name: string;
}

export interface Book {
  id: number;
  title?: string;
  author?: string;
  publisher?: string;
  url?: string;
  description?: string;
  number?: number;
  categories?: number[];
  price?: number;
}

export interface BookInsertDto {
  title?: string;
  author?: string;
  publisher?: string;
  url?: string;
  description?: string;
  number?: number;
  categories?: number[];
  price?: number;
}

export interface ResultPaging<T> {
  count?: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface BooksByCategory {
  bookCategoryId: number;
  category: string;
  subCategory: string;
  books: Book[];
}

export interface Record {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  return_date: string;
  status: string;
  is_complete: boolean;
}

export interface RecordAdmin {
  id: number;
  user: number;
  book: Book;
  borrow_date: string;
  return_date: string;
  status: string;
}
