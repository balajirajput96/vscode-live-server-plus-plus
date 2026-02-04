import { ServerResponse } from 'http';
import { ILSPPIncomingMessage } from '../../core/types';
import { contentType } from 'mime-types';
import * as path from 'path';

export const setMIME = (request: ILSPPIncomingMessage, res: ServerResponse) => {
  const extname = path.extname(request.file!);

  request.contentType = String(contentType(extname));
  res.setHeader('content-type', String(contentType(extname)));
};
