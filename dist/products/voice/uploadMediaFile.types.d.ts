export interface UploadMediaFileOptions {
    url: string;
}
export interface UploadMediaFilePostData extends UploadMediaFileOptions {
    username: string;
}
export interface UploadMediaFileResponse {
}
export declare type UploadMediaFile = (options: UploadMediaFileOptions) => Promise<UploadMediaFileResponse>;
