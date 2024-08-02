import fs from 'node:fs'
import path from 'node:path'
import logger from '@/lib/logger'
import { Readable } from 'stream'
import { finished } from 'node:stream/promises'
import { Buffer } from 'buffer'

export const exists = async (filename: string) =>
  !!(await fs.promises.stat(filename).catch(() => null))

export async function saveFile (filepath: string, file: any | null) {
  if (file == null) return

  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  // write file to disk
  const fileStream = fs.createWriteStream(filepath)
  await finished(Readable.fromWeb(file).pipe(fileStream))

  logger.info('File saved successfully')
}

export async function saveFileBuffer (filepath: string, file: Buffer) {
  logger.info(`Saving file to ${filepath}`)
  if (!(await exists(filepath))) {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
  }

  try {
    await fs.promises.writeFile(filepath, file)
    logger.info('File saved successfully')
  } catch (error) {
    logger.error('Error saving the file:', error)
  }
}
