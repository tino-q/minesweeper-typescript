import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~constants';

export const NOT_FOUND = 'not_found';
export const notFoundError = createError(NOT_FOUND, STATUS_CODES.NOT_FOUND);

export const INVALID_SCHEMA = 'invalid_schema';
export const schemaError = createError(INVALID_SCHEMA, STATUS_CODES.UNPROCESSABLE_ENTITY);

export const EXTERNAL_PROVIDER_ERROR = 'external_provider_error';
export const externalProviderError = createError(EXTERNAL_PROVIDER_ERROR, STATUS_CODES.SERVICE_UNAVAILABLE);

export const BAD_REQUEST_ERROR = 'bad_request_error';
export const badRequestError = createError(BAD_REQUEST_ERROR, STATUS_CODES.BAD_REQUEST);
