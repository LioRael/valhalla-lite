import { os } from '@orpc/server';
import { z } from 'zod';
import path from 'path';
import fs from 'fs-extra';
import { baseMiddleware } from '../middlewares/base';

export const filesRouter = os.router({
  getFiles: os
    .use(baseMiddleware)
    .input(
      z.object({
        path: z.string(),
      }),
    )
    .func(({ path }, { basePath }) => {
      const fullPath = `${basePath}/${path}`;
      return fs
        .readdirSync(fullPath)
        .filter((file) => !file.startsWith('.'))
        .map((file) => ({
          name: file,
          path: `${fullPath}/${file}`,
          isDirectory: fs.statSync(`${fullPath}/${file}`).isDirectory(),
        }));
    }),

  rename: os
    .use(baseMiddleware)
    .input(
      z.object({
        path: z.string(),
        name: z.string(),
      }),
    )
    .func(({ path: oldPath, name }, { basePath }) => {
      const sourcePath = path.join(basePath, oldPath);

      const sourceDir = path.dirname(sourcePath);
      const targetPath = path.join(sourceDir, name);

      fs.renameSync(sourcePath, targetPath);
    }),

  move: os
    .use(baseMiddleware)
    .input(
      z.object({
        sourcePath: z.string(),
        fileNames: z.array(z.string()),
        targetPath: z.string(),
      }),
    )
    .func(({ sourcePath, fileNames, targetPath }, { basePath }) => {
      // 确保目标目录存在
      const fullTargetPath = path.join(basePath, targetPath);
      fs.ensureDirSync(fullTargetPath);

      // 移动每个选中的文件
      fileNames.forEach((fileName) => {
        const sourceFilePath = path.join(basePath, sourcePath, fileName);
        const targetFilePath = path.join(fullTargetPath, fileName);

        // 检查源文件是否存在
        if (fs.existsSync(sourceFilePath)) {
          fs.moveSync(sourceFilePath, targetFilePath, { overwrite: false });
        }
      });
    }),

  upload: os
    .use(baseMiddleware)
    .input(
      z.object({
        targetPath: z.string(),
        files: z.array(z.instanceof(File)),
      }),
    )
    .func(async ({ targetPath, files }, { basePath }) => {
      const fullPath = path.join(basePath, targetPath);
      fs.ensureDirSync(path.dirname(fullPath));

      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const filePath = path.join(fullPath, file.name);
        fs.writeFileSync(filePath, Buffer.from(buffer));
      }
    }),

  read: os
    .use(baseMiddleware)
    .input(
      z.object({
        filePath: z.string(),
      }),
    )
    .func(({ filePath }, { basePath }) => {
      return fs.readFileSync(path.join(basePath, filePath), 'utf-8');
    }),

  write: os
    .use(baseMiddleware)
    .input(
      z.object({
        filePath: z.string(),
        content: z.string(),
      }),
    )
    .func(({ filePath, content }, { basePath }) => {
      fs.writeFileSync(path.join(basePath, filePath), content);
    }),
});
