import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HandoverRequest, HandoverResponse } from "../models/handover.model";
import { Page } from "../../../core/models/page.model";
import { ProblemDetail } from "../../../core/models/problem-detail.model";


@Injectable({
    providedIn: 'root'
})
export class HandoverService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/handovers`;

    /**
   * Envía el payload para crear un Handover.
   * La ciberseguridad y validación del JWT/CORS se maneja automáticamente por el Interceptor del Core.
   */

    createHandover(request: HandoverRequest): Observable<HandoverResponse> {
        return this.http.post<HandoverResponse>(this.apiUrl, request).pipe(
            catchError(this.handleError)
        );
    }

    getHandovers(page: number, size: number, projectId?: string, status?: string): Observable<Page<HandoverResponse>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if(projectId) params = params.set('projectId', projectId);
        if(status) params = params.set('status', status);

        return this.http.get<Page<HandoverResponse>>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(error: HttpErrorResponse): Observable<never>{
        let problemDetail: ProblemDetail;

        if(error.error && error.error.title){
            problemDetail = error.error as ProblemDetail;
        } else {
            problemDetail = {
                type: 'about:blank',
                title: 'Error de Red / Indisponibilidad',
                status: error.status === 0 ? 503 : error.status,
                detail: 'No se pudo establecer conexion con el servidor, verifique su red',
            };
        }

        return throwError(() => problemDetail);
    }
}