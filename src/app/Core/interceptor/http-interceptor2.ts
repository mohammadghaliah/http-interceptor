import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    debugger;
    // if (req.headers.get("content-type1")) {
    //     console.log('header2',req.headers);
    // }

    req = req.clone({
      setHeaders: {
        authorization:
          'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfbmFtZSI6ImFkbWluLnNlY3VyaXR5QHRhaGFsdWYuYWUiLCJleHAiOjE2NjIyOTQ3MzgsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzEwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIn0.yPX4pzmORRKHJ1tB3czrMIq593rQ8iYlGYYKrwIjjK4',
      },
    });

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // if (req.headers.get("show-Spinner")) {
            //     // this.hideSpinner();
            // }
          }
        },
        async (err: any) => {
          debugger;
          if (err instanceof HttpErrorResponse) {
            // const errors = await this.getResponseErrors(err);
            // some apis wants to ignore the error, to custom the mesasge
            if (!req.headers.get('skip-interceptor-error')) {
              if (
                err.status === HttpStatusCode.Unauthorized ||
                err.status === HttpStatusCode.Forbidden
              ) {
                console.log('Unauthorized');
                // if (this.authenticationService.isAuthunticated()) {
                //     this.notifyService.showApiError("general.error", errors);
                //     this.authenticationService.logout();
                // }
                // this.navigate();
              } else if (err.status === HttpStatusCode.ServiceUnavailable) {
                // this.router.navigate(['maintenance']);
              } else if (err.status === HttpStatusCode.InternalServerError) {
                // this.notifyService.showApiError("general.error", errors);
              }
            }
          }

          // if (req.headers.get("show-Spinner")) {
          //     this.hideSpinner();
          // }
        }
      )
    );
  }
}
