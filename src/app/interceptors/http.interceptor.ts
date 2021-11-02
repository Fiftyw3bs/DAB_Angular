import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import data from '../../../api-database.json';

@Injectable()
export class BackendHttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes('dagribiz.farm') &&
      request.method === 'POST' &&
      request.url.endsWith('login')
    ) {
      const body = JSON.parse(request.body);
      const resData = data.user.find(
        ({ password, email }) =>
          body.email === email && body.password === password
      );
      if (resData) {
        return of(new HttpResponse({ status: 200, body: [resData] }));
      } else {
        return of(new HttpResponse({ status: 200, body: undefined }));
      }
    }
    return next.handle(request);
  }
}
