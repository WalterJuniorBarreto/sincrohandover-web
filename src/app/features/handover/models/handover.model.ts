export interface HandoverRequest {
    readonly authorId: string;
    readonly projectId: string;
    readonly categoryId: string;
    readonly payload: string;
}

export interface HandoverResponse {
    readonly id: string;
    readonly status: string;
    readonly payload: string;
    readonly createdAt: string;
    readonly authorEmail: string;
    readonly projectName: string;
    readonly categoryName: string;
    
    
}