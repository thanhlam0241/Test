import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, map } from 'rxjs';
import {
  Book,
  BookCategory,
  ResultPaging,
  Record,
  User,
  ResultLogin,
  BookInsertDto,
  BookCategoryInsertDto,
  RecordAdmin,
} from '../../models/models';
import { environment as env } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = env.apiUrl; //
  userStatus: Subject<string> = new Subject();

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private router: Router
  ) {}
  /****************************API users *****************************/
  /**
   * Register new user
   * @param user
   * @returns
   */
  register(user: any) {
    return this.http.post(this.baseUrl + '/register', user, {
      responseType: 'text',
    });
  }

  /**
   * Login
   * @param info
   * @returns
   */
  login(info: any) {
    return this.http.post<ResultLogin>(this.baseUrl + '/login', {
      email: info.email,
      password: info.password,
    });
  }

  /**
   * Check login
   * @returns
   */
  isLoggedIn(): boolean {
    if (localStorage.getItem('access') == null) return false;
    if (this.jwt.isTokenExpired()) {
      localStorage.removeItem('access');
      return false;
    }
    return true;
  }

  /**
   * Check is admin
   * @returns
   */
  isAdmin(): boolean {
    let user = this.getUserInfo();
    if (!user) return false;
    return user?.is_staff || false;
  }

  getUserInfo(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    } else if (this.jwt.isTokenExpired()) {
      localStorage.removeItem('access');
      return null;
    }
    var decodedToken = this.jwt.decodeToken();
    var user: User = {
      id: decodedToken.data.id,
      email: decodedToken.data.email,
      name: decodedToken.data.name,
      mobileNumber: decodedToken.data.mobileNumber,
      is_staff: decodedToken.data.is_staff,
      date_joined: decodedToken.data.date_joined,
      address: decodedToken.data.address,
    };
    return user;
  }

  logOut() {
    localStorage.removeItem('access');
    this.userStatus.next('loggedOff');
    this.router.navigateByUrl('/login');
  }

  getUsers(page: number) {
    return this.http.get<ResultPaging<User>>(
      this.baseUrl + '/users/' + `?page=${page}`
    );
  }

  blockUsers() {
    return this.http.get(this.baseUrl + 'BlockFineOverdueUsers', {
      responseType: 'text',
    });
  }

  /**************************************BOOK*****************************************/
  getBooks(page: number, filter: string | null) {
    let url = this.baseUrl + '/books/' + `?page=${page}`;
    if (filter) {
      url = url + `&title=${filter}`;
    }
    return this.http.get<ResultPaging<Book>>(url);
  }

  getBookinfo(id: number) {
    let url = this.baseUrl + `/books/${id}`;
    return this.http.get<Book>(url);
  }

  updateBook(newBook: Book) {
    return this.http.put<any>(`${this.baseUrl}/books/${newBook.id}`, {
      ...newBook,
    });
  }

  getBookStatus(bookId: number) {
    try {
      let user = this.getUserInfo();
      if (!user) return new Subject();
      return this.http.post<Record[]>(
        this.baseUrl + '/records/get_status_book/',
        {
          userId: user.id,
          bookId,
        }
      );
    } catch (ex) {
      return new Subject();
    }
  }

  addBook(book: BookInsertDto) {
    if (!this.isAdmin()) return new Subject();
    return this.http.post(this.baseUrl + '/books/', book, {
      responseType: 'text',
    });
  }

  deleteBook(id: number) {
    if (!this.isAdmin()) return new Subject();
    return this.http.delete(this.baseUrl + '/books', {
      params: new HttpParams().append('id', id),
      responseType: 'text',
    });
  }

  /*****************************************ORDER**************************************/
  borrowBook(bookId: number) {
    try {
      let user = this.getUserInfo();
      if (!user) return new Subject();

      return this.http.post(this.baseUrl + '/records/borrow/', {
        userId: user.id,
        bookId: bookId,
      });
    } catch (ex) {
      return new Subject();
    }
  }

  returnBook(bookId: number) {
    try {
      let user = this.getUserInfo();
      if (!user) return new Subject();

      if (!this.isAdmin()) return new Subject();
      return this.http.post(this.baseUrl + '/records/return/', {
        userId: user.id,
        bookId,
      });
    } catch (ex) {
      return new Subject();
    }
  }

  acceptBorrow(userId: number, bookId: number) {
    try {
      let user = this.getUserInfo();
      if (!user) return new Subject();
      if (!this.isAdmin()) return new Subject();
      return this.http.post(this.baseUrl + '/records/accept_borrow/', {
        userId: userId,
        bookId,
      });
    } catch (ex) {
      return new Subject();
    }
  }

  acceptReturn(userId: number, bookId: number) {
    try {
      let user = this.getUserInfo();
      if (!user) return new Subject();

      if (!this.isAdmin()) return new Subject();
      return this.http.post(this.baseUrl + '/records/accept_return/', {
        userId: userId,
        bookId,
      });
    } catch (ex) {
      return new Subject();
    }
  }

  getBorrowBookList(id: number) {
    return this.http.get<Record[]>(
      this.baseUrl + '/records/get_number_borrow',
      {
        params: new HttpParams().append('bookId', id),
      }
    );
  }

  orderBook(book: Book) {
    let userId = this.getUserInfo()!.id;

    return this.http.post(
      this.baseUrl + '/records/borrow',
      {
        userId: userId,
        bookId: book.id,
      },
      {
        responseType: 'text',
      }
    );
  }

  getAllOrder(page: number, status: string) {
    return this.http.get<ResultPaging<RecordAdmin>>(
      this.baseUrl + '/records' + `?page=${page}&status=${status}`
    );
  }

  getOrdersOfUser(userId: number) {
    let params = new HttpParams().append('userId', userId);
    return this.http
      .get<any>(this.baseUrl + '/records/get_by_user_id', {
        params: params,
      })
      .pipe(
        map((orders) => {
          let newOrders = orders.map((order: Record) => {
            let newOrder: Record = {
              id: order.id,
              user_id: order.user_id,
              book_id: order.book_id,
              borrow_date: order.borrow_date,
              return_date: order.return_date,
              status: order.status,
              is_complete: order.is_complete,
            };
            return newOrder;
          });
          return newOrders;
        })
      );
  }

  getFine(order: Record) {
    let today = new Date();
    let orderDate = new Date(Date.parse(order.borrow_date));
    orderDate.setDate(orderDate.getDate() + 10);
    if (orderDate.getTime() < today.getTime()) {
      var diff = today.getTime() - orderDate.getTime();
      let days = Math.floor(diff / (1000 * 86400));
      return days * 50;
    }
    return 0;
  }

  getOrders() {
    return this.http.get<any>(this.baseUrl + '/records').pipe(
      map((orders) => {
        let newOrders = orders.map((order: any) => {
          let newOrder: Record = {
            id: order.id,
            user_id: order.user_id,
            book_id: order.book_id,
            borrow_date: order.borrow_date,
            return_date: order.return_date,
            status: order.status,
            is_complete: order.is_complete,
          };
          return newOrder;
        });
        return newOrders;
      })
    );
  }

  /*********************************Category**********************************/
  addNewCategory(category: BookCategoryInsertDto) {
    if (!this.isAdmin()) return new Subject();
    return this.http.post(this.baseUrl + '/categories', category, {
      responseType: 'text',
    });
  }

  getCategoriesByListIds(ids: number[]) {
    return this.http.post<ResultPaging<BookCategory>>(
      this.baseUrl + '/categories',
      {
        list: ids,
      }
    );
  }

  getCategories() {
    return this.http.get<ResultPaging<BookCategory>>(
      this.baseUrl + '/categories'
    );
  }

  approveRequest(userId: number) {
    if (!this.isAdmin()) return;
    return this.http.get(this.baseUrl + 'ApproveRequest', {
      params: new HttpParams().append('userId', userId),
      responseType: 'text',
    });
  }

  sendEmail() {
    return this.http.get(this.baseUrl + 'SendEmailForPendingReturns', {
      responseType: 'text',
    });
  }

  unblock(userId: number) {
    return this.http.get(this.baseUrl + 'Unblock', {
      params: new HttpParams().append('userId', userId),
      responseType: 'text',
    });
  }
}
