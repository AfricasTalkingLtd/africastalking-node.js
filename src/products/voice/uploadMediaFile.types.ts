export interface UploadMediaFileOptions {
  url: string;
}

export interface UploadMediaFilePostData extends UploadMediaFileOptions {
  username: string;
}

// TODO: no documentation available
export interface UploadMediaFileResponse {

}

export type UploadMediaFile = (options: UploadMediaFileOptions) => Promise<UploadMediaFileResponse>;
