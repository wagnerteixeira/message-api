import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { ValidationError } from 'class-validator';
import BadRequestError from '../errors/BadRequestError';
import InternalServerError from '../errors/InternalServerError';
import NotFoundError from '../errors/NotFoundError';
import { AuthorizationError } from '../errors/AuthorizationError';
import logger from '../lib/logger';

const handleValidationError = (errors: ValidationError[], req: Request, res: Response) => {
  const validationReturn = [];
  for (const error of errors) {    
    for (const constraint of Object.keys(error.constraints!)) {
      logger.error({
        message: `[Error] ${error.constraints![constraint]} ${req.method} ${req.url} ErrorCode: ${error.contexts?.[constraint].errorCode}`
      });
      validationReturn.push({
        code: error.contexts?.[constraint].errorCode,
        message: error.constraints![constraint]
      });
    }
  }

  res.status(BAD_REQUEST).json(validationReturn);
};

const handleCustomError = (req: Request, error: BadRequestError, res: Response, statusCode: number) => {
  logger.error({
    message: `[Error] ${error.message} ${req.method} ${req.url} ErrorCode: ${error.errorCode}`
  });

  res.status(statusCode).json({
    code: error.errorCode,
    message: error.message
  });
};

export default function(
  err: ValidationError[] | BadRequestError | InternalServerError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (Array.isArray(err) && err.every((error: ValidationError) => error instanceof ValidationError)) {
    handleValidationError(err, req, res);
  } else if (err instanceof NotFoundError) {
    res.status(NOT_FOUND).send();
  } else if (err instanceof BadRequestError) {
    handleCustomError(req, err, res, BAD_REQUEST);
  } else if (err instanceof InternalServerError) {
    handleCustomError(req, err, res, INTERNAL_SERVER_ERROR);
  } else if (err instanceof AuthorizationError) {
    logger.error({
      message: `[Error] ${err.message} ${req.method} ${req.url}`
    });
    res.status(UNAUTHORIZED).send();
  } else {
    const { message, stack } = err as Error;

    logger.error({
      message: `[Error] INTERNAL SERVER ERROR ${req.url} ${INTERNAL_SERVER_ERROR}\n\n${message}`,
      stack
    });

    res.status(INTERNAL_SERVER_ERROR).send();
  }

  next();
}
