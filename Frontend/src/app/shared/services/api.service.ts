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
} from '../../models/models';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = env.apiUrl; //
  userStatus: Subject<string> = new Subject();

  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  register(user: any) {
    return this.http.post(this.baseUrl + '/register', user, {
      responseType: 'text',
    });
  }

  login(info: any) {
    return this.http.post<ResultLogin>(this.baseUrl + '/login', {
      email: info.email,
      password: info.password,
    });
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('access') != null) return true;
    return false;
  }

  getUserInfo(): User | null {
    if (!this.isLoggedIn()) return null;
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
  }

  getBooks(page: number) {
    return this.http.get<ResultPaging<Book>>(
      this.baseUrl + '/books/' + `${page == 1 ? '' : '?page=' + page}`
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

  getOrdersOfUser(userId: number) {
    let params = new HttpParams().append('userId', userId);
    return this.http
      .get<any>(this.baseUrl + '/books/get_by_user_id', {
        params: params,
      })
      .pipe(
        map((orders) => {
          let newOrders = orders.map((order: any) => {
            let newOrder: Record = {
              id: order.id,
              userId: order.userId,
              userName: order.user.name,
              bookId: order.bookId,
              bookTitle: order.book.title,
              borrow_date: order.borrow_date,
              return_date: order.return_date,
              status: order.status,
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

  addNewCategory(category: BookCategory) {
    return this.http.post(this.baseUrl + 'AddCategory', category, {
      responseType: 'text',
    });
  }

  getCategories() {
    return this.http.get<BookCategory[]>(this.baseUrl + 'GetCategories');
  }

  addBook(book: Book) {
    return this.http.post(this.baseUrl + '/books', book, {
      responseType: 'text',
    });
  }

  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + '/books', {
      params: new HttpParams().append('id', id),
      responseType: 'text',
    });
  }

  borrowBook(userId: string, bookId: string, fine: number) {
    return this.http.get(this.baseUrl + '/records/borrow_book', {
      params: new HttpParams()
        .append('userId', userId)
        .append('bookId', bookId)
        .append('fine', fine),
      responseType: 'text',
    });
  }

  returnBook(userId: string, bookId: string, fine: number) {
    return this.http.get(this.baseUrl + '/records/return_book', {
      params: new HttpParams()
        .append('userId', userId)
        .append('bookId', bookId)
        .append('fine', fine),
      responseType: 'text',
    });
  }

  getUsers() {
    return this.http.get<ResultPaging<User>>(this.baseUrl + '/users');
  }

  approveRequest(userId: number) {
    return this.http.get(this.baseUrl + 'ApproveRequest', {
      params: new HttpParams().append('userId', userId),
      responseType: 'text',
    });
  }

  getOrders() {
    return this.http.get<any>(this.baseUrl + '/records').pipe(
      map((orders) => {
        let newOrders = orders.map((order: any) => {
          let newOrder: Record = {
            id: order.id,
            userId: order.userId,
            userName: order.user.name,
            bookId: order.bookId,
            bookTitle: order.book.title,
            borrow_date: order.borrow_date,
            return_date: order.return_date,
            status: order.status,
          };
          return newOrder;
        });
        return newOrders;
      })
    );
  }

  sendEmail() {
    return this.http.get(this.baseUrl + 'SendEmailForPendingReturns', {
      responseType: 'text',
    });
  }

  blockUsers() {
    return this.http.get(this.baseUrl + 'BlockFineOverdueUsers', {
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
