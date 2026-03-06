import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(MsalService);
  const account = authService.instance.getActiveAccount() || authService.instance.getAllAccounts()[0];

  if (account && req.url.startsWith(environment.apiUrl)) {
    return from(authService.acquireTokenSilent({
      account: account,
      scopes: environment.azureConfig.scopes
    })).pipe(
      switchMap((result) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`
          }
        });
        return next(authReq);
      })
    );
  }

  return next(req);
};
