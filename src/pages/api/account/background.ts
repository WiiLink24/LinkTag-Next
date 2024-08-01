import { IncomingForm, Fields, Files } from 'formidable'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ncWithSession } from '@/lib/routing'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { saveFileBuffer } from '@/lib/utils/fileUtils'
import { CACHE } from '@/lib/constants/filePaths'
import prisma from '@/lib/db'
import { makeBanner } from '@/lib/riitag/banner'
import logger from '@/lib/logger'
import { Request, Response } from 'express'
import { setFileHeaders } from '../../../lib/utils/utils'
import fs from 'node:fs'

async function backgroundPost (request: Request, response: Response) {
  if (request.socket.bytesRead > 2_107_638) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' })
  }

  // @ts-ignore
  const username: string = request.session?.username

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  const data: unknown = await new Promise((resolve, reject): void => {
    const form = new IncomingForm()

    form.parse(request, (error, fields: Fields<string>, files: Files<string>): void => {
      if (error) return reject(error)
      return resolve({ fields, files })
    })
  })
    .catch((error) => {
      logger.error(error)
      return response
        .status(HTTP_CODE.BAD_REQUEST)
        .send({ error: 'Invalid data' })
    })

  // @ts-ignore
  const { file } = data.files

  if (file.mimetype !== 'image/png') {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' })
  }

  // Hard cap of 2MBs for custom backgrounds
  if (file.size > 2_000_000) {
    return response
      .status(HTTP_CODE.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: 'Request entity too large.' })
  }

  let user: {username: string} = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      username: true
    }
  })

  const filepath: string = path.resolve(CACHE.BACKGROUNDS, `${user.username}.png`)
  await saveFileBuffer(filepath, await readFile(file.filepath))

  user = await prisma.user.update({
    where: {
      username
    },
    data: {
      background: `${user.username}.png`
    }
  })

  await makeBanner(user)
  return response.status(HTTP_CODE.OK).send()
}

async function backgroundGet (request: Request, response: Response) {
  // @ts-ignore
  const username = request.session?.username

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' })
  }

  response.setHeader('Content-Type', 'image/png')
  setFileHeaders(response, `${username}.png`)
  return response
    .status(HTTP_CODE.OK)
    .send(await fs.promises.readFile(path.resolve(CACHE.BACKGROUNDS, username + '.png')))
}

const handler = ncWithSession().post(backgroundPost).get(backgroundGet)

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
