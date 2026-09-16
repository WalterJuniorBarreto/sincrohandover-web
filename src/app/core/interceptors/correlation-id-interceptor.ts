import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

function generateUUID(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 'fallback-' + new Date().getTime();
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  
  const correlationId = generateUUID();

  const modifiedReq = req.clone({
    setHeaders: {
      'X-Correlation-ID': correlationId
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const traceId = error.error?.trace_id || correlationId;

      console.error(`CRITICO Fallo HTTP en Frontend. TRACE-ID: ${traceId}`);
      console.error("Detalle del Backend:", error.error);

      return throwError(() => error);
    })
  );
};
