import { IncomingForm } from 'formidable';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { saveFile, saveFileBuffer } from '@/lib/utils/fileUtils'
import { CACHE } from '@/lib/constants/filePaths';
import prisma from '@/lib/db';
import { makeBanner } from '@/lib/riitag/banner';
import logger from '@/lib/logger';

async function uploadBackground(request, response) {
  if (request.socket.bytesRead > 2_107_638) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' });
  }
  const username = request.session?.username;

  console.log('saving.. 1')

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(request, (error, fields, files) => {
      if (error) {
        return reject(error);
      }
      return resolve({ fields, files });
    });
  }).catch((error) => {
    logger.error(error);
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  });

  const { file } = data.files;

  console.log('saving.. 2')

  if (file.mimetype !== 'image/png') {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  // Hard cap of 2MBs for custom backgrounds
  if (file.size > 2_000_000) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' });
  }

  console.log('saving.. 2.5')

  let user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  const filepath = path.resolve(CACHE.BACKGROUNDS, `${user.username}.png`);

  console.log('saving.. 3')

  try {
    await saveFileBuffer(filepath, await readFile(file.filepath));

    user = await prisma.user.update({
      where: {
        username,
      },
      data: {
        background: `${user.username}.png`,
      },
    });
  } catch (error) {
    logger.error(error);
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  await makeBanner(user);
  return response.status(HTTP_CODE.OK).send();
}

const handler = ncWithSession().post(uploadBackground);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
