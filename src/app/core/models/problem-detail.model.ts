export interface ProblemDetail {
    readonly type: string;
    readonly title: string;
    readonly status: number;
    readonly detail: string;
    readonly instance?: string;
    readonly trace_id?: string;
    readonly invalid_params?: Record<string, string>;
}