// import { Injectable, Injector } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { SpinnerService } from 'src/app/shared/controls/spinner/spinner.service';
// import { HttpStatusCode } from 'src/app/shared/enum/http-status-code-enum';
// import { AuthenticationService } from '../services/authentication.service';
// import { NotifyService } from '../services/notify.service';
// import { tap } from 'rxjs/operators';
// import { ExpiredSubscriptionService } from 'src/app/shared/services/expired-subscription.service';
// import { Environment } from '../services/environment-service';

// @Injectable()
// export class HttpRequestInterceptor implements HttpInterceptor {
//    router: Router;
//    spinnersCount = 0;
//    accountCode: string;
//    constructor(private authenticationService: AuthenticationService,
//       private spinnerService: SpinnerService,
//       private notifyService: NotifyService,
//       private expiredSubscriptionService: ExpiredSubscriptionService,
//       private injector: Injector,
//       private environment: Environment) {
//       this.router = this.injector.get(Router);
//    }

//    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//       if (req.headers.get("show-Spinner")) {
//          this.showSpinner();
//       }

//       if (!req.headers.get("skip-authorization") && !req.headers.get("authorization")) {
//          if (req.url.toLowerCase().includes(this.environment.serviceUrl.toLowerCase()) && this.authenticationService.isAuthunticated()) {
//             req = req.clone({
//                setHeaders: {
//                   "authorization": "Bearer " + this.authenticationService.getToken(),
//                }
//             });
//          }
//       }

//       return next.handle(req).pipe(tap(
//          (event: HttpEvent<any>) => {
//             if (event instanceof HttpResponse) {
//                if (req.headers.get("show-Spinner")) {
//                   this.hideSpinner();
//                }
//             }
//          },
//          async (err: any) => {
//             if (err instanceof HttpErrorResponse) {
//                const errors = await this.getResponseErrors(err);
//                // some apis wants to ignore the error, to custom the mesasge
//                if (!req.headers.get("skip-interceptor-error")) {
//                   if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
//                      if (this.authenticationService.isAuthunticated()) {
//                         this.notifyService.showApiError("general.error", errors);
//                         this.authenticationService.logout();
//                      }

//                      if (!this.router.url.startsWith("/sso")) {
//                         this.navigate();
//                      }
//                   }
//                   else if (err.status === HttpStatusCode.ServiceUnavailable) {
//                      this.router.navigate(['maintenance']);
//                   }
//                   else if (err.status === HttpStatusCode.InternalServerError) {
//                      this.notifyService.showApiError("general.error", errors);
//                   }
//                   else if (err.status === HttpStatusCode.Gone) {
//                      this.expiredSubscriptionService.setIsExpired(true);
//                   }
//                }
//             }

//             if (req.headers.get("show-Spinner")) {
//                this.hideSpinner();
//             }
//          }
//       ));
//    }

//    async getResponseErrors(err: HttpErrorResponse) {
//       let errors: HttpErrorResponse[];
//       if (err.error && err.error instanceof Blob) {
//          const error: any = err.error;
//          errors = JSON.parse(await error.text());
//       }
//       else {
//          errors = err.error;
//       }
//       return errors;
//    }

//    showSpinner() {
//       this.spinnersCount++;
//       this.spinnerService.showSpinner();
//    }

//    hideSpinner() {
//       this.spinnersCount--;
//       if (this.spinnersCount <= 0) {
//          this.spinnerService.hideSpinner();
//       }
//    }

//    navigate() {
//       this.accountCode = this.authenticationService.getAccountCode();
//       if (this.accountCode) {
//          if (this.router.url.includes("self-service")) {
//             this.router.navigate([`${this.accountCode}/self-service`]);
//             return;
//          }
//          this.router.navigate([`${this.accountCode}/admin`]);
//          return;
//       }
//       this.router.navigate([`admin`]);
//    }
// }

import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  router: Router;
  spinnersCount = 0;
  accountCode: string;
  constructor(private injector: Injector) {
    this.router = this.injector.get(Router);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get('show-Spinner')) {
      this.showSpinner();
    }

    if (
      !req.headers.get('skip-authorization') &&
      !req.headers.get('authorization')
    ) {
      if (
        req.url.toLowerCase() /* &&
        this.authenticationService.isAuthunticated()*/
      ) {
        req = req.clone({
          setHeaders: {
            authorization:
              'Bearer ' + /*this.authenticationService.getToken(),*/ '',
          },
        });
      }
    }

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (req.headers.get('show-Spinner')) {
              this.hideSpinner();
            }
          }
        },
        async (err: any) => {
          if (err instanceof HttpErrorResponse) {
            const errors = await this.getResponseErrors(err);
            // some apis wants to ignore the error, to custom the mesasge
            if (!req.headers.get('skip-interceptor-error')) {
              if (
                err.status === /*  HttpStatusCode.Unauthorized  */ 401 ||
                err.status === /* HttpStatusCode.Forbidden */ 403
              ) {
                if (/*this.authenticationService.isAuthunticated()*/ '') {
                  /* this.notifyService.showApiError('general.error', errors);
                  this.authenticationService.logout(); */
                }

                if (!this.router.url.startsWith('/sso')) {
                  this.navigate();
                }
              } else if (
                err.status === /*HttpStatusCode.ServiceUnavailable*/ 305
              ) {
                this.router.navigate(['maintenance']);
              } else if (
                err.status === /* HttpStatusCode.InternalServerError*/ 500
              ) {
                /* this.notifyService.showApiError('general.error', errors);*/
              } else if (err.status === /* HttpStatusCode.Gone*/ 410) {
                //  this.expiredSubscriptionService.setIsExpired(true);
              }
            }
          }

          if (req.headers.get('show-Spinner')) {
            this.hideSpinner();
          }
        }
      )
    );
  }

  async getResponseErrors(err: HttpErrorResponse) {
    let errors: HttpErrorResponse[];
    if (err.error && err.error instanceof Blob) {
      const error: any = err.error;
      errors = JSON.parse(await error.text());
    } else {
      errors = err.error;
    }
    return errors;
  }

  showSpinner() {
    this.spinnersCount++;
    /* this.spinnerService.showSpinner();*/
  }

  hideSpinner() {
    this.spinnersCount--;
    if (this.spinnersCount <= 0) {
      // this.spinnerService.hideSpinner();
    }
  }

  navigate() {
    this.accountCode = /*this.authenticationService.getAccountCode();*/ '';
    if (this.accountCode) {
      if (this.router.url.includes('self-service')) {
        this.router.navigate([`${this.accountCode}/self-service`]);
        return;
      }
      this.router.navigate([`${this.accountCode}/admin`]);
      return;
    }
    this.router.navigate([`admin`]);
  }
}

// -------

// isAuthunticated(): boolean {
//   let isAuthunticated = false;

//   const token = this.getToken();
//   if (token) {
//       isAuthunticated = true;
//   }

//   return isAuthunticated;
// }

// getToken() {
//   const storageKey = this.getUserStorageKey();

//   const currentUser = StorageManager.get(storageKey);
//   const token = currentUser ? currentUser.token : null;
//   return token;
// }

// this.authenticationService.logout(){
// removeAllUsers() {
//   StorageManager.removeAll();
// }
// }
