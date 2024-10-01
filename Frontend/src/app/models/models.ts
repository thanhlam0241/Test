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
  STUDENT,
}

export interface BookCategory {
  id: number;
  category: string;
  subCategory: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  url: string;
  available: boolean;
  bookCategoryId: number;
  bookCategory: BookCategory;
}

export interface ResultPaging<T> {
  count: number;
  next: string;
  previous: string;
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
  userId: number;
  userName: string | null;
  bookId: number;
  bookTitle: string;
  borrow_date: string;
  return_date: string;
  status: string;
}
