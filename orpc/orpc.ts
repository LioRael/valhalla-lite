import {
  os,
  type InferRouterInputs,
  type InferRouterOutputs,
} from '@orpc/server';
import { folderRouter } from './routes/folder';
import { filesRouter } from './routes/files';

export const router = os.router({
  folder: folderRouter,
  files: filesRouter,
});

export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;
