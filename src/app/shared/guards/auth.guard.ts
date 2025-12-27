import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth/auth.service';
import {catchError, map, of} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getMeInfo().pipe(
    map(user => {
      if (user.is_admin || user.is_secretary) {
        return true;
      }

      // router.navigate(['/error/no-permission']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/error/no-permission']);

      return of(false);
    })
  );
};
