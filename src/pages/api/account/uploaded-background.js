import fs from 'node:fs';
import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { setFileHeaders } from '@/lib/utils/utils';
import { CACHE } from '@/lib/constants/filePaths';

async function getMyUploadedBackground(request, response) {

}

const handler = ncWithSession().get(getMyUploadedBackground);

export default handler;
