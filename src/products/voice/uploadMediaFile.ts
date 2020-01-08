import joi from 'joi';
import queryString from 'query-string';
import { Credentials } from '../../utils/getFullCredentials.types';
import { getFullCredentials } from '../../utils/getFullCredentials';
import { sendRequest, validateJoiSchema } from '../../utils/misc';
import { UploadMediaFileOptions, UploadMediaFileResponse, UploadMediaFilePostData } from './uploadMediaFile.types';

const getSchema = () => joi.object({
  url: joi.string().regex(/^https?:\/\//, 'url').required(),
}).required();

export const uploadMediaFile = (credentials: Credentials) => async (
  options: UploadMediaFileOptions,
): Promise<UploadMediaFileResponse> => {
  const { apiKey, username, format } = await getFullCredentials(credentials);
  const result = validateJoiSchema<UploadMediaFileOptions>(getSchema(), options);

  const data: UploadMediaFilePostData = { ...result, username };

  return sendRequest<UploadMediaFileResponse, string>({
    endpointCategory: 'UPLOAD_MEDIA_FILE',
    username,
    method: 'POST',
    data: queryString.stringify(data),
    headers: {
      apiKey,
      accept: format,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
