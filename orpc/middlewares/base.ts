import { os } from '@orpc/server';
import fs from 'fs-extra';
export const baseMiddleware = os.middleware(async (_input, _context, meta) => {
  const basePath = fs.readFileSync('rootFolder.txt', 'utf8');
  return meta.next({
    ...meta,
    context: {
      basePath,
    },
  });
});
