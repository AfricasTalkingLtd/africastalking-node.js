import { Credentials } from '../../utils/getFullCredentials.types';
import { UploadMediaFileOptions, UploadMediaFileResponse } from './uploadMediaFile.types';
export declare const uploadMediaFile: (credentials: Credentials) => (options: UploadMediaFileOptions) => Promise<UploadMediaFileResponse>;
