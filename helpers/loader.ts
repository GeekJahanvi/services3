/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import glob from 'glob';
import express, { Router } from 'express';
import { join, relative } from 'path';
import replaceSpecialChars from './replace-special-chars';
import path from 'path';

const router: Router = express.Router();

export default async (folderName: string): Promise<Router> => {
  const folderPath = join(process.cwd(), folderName);

  const files = glob.sync('**/*.@(js|ts|tsc)', {
    cwd: folderPath,
    ignore: [
      '/node_modules/', // ignore node_modules directories
      '/*/', // ignore files inside directories that start with _
      '/*' // ignore files that start with _
    ],
    absolute: true // to get absolute path of files
  });

  for await (const file of files) {
    const { default: handler } = await import(file);
    // File path relative to the project root directory. Used for logging.
    const relativePath = relative('.', file);

    if (handler) {
      const dirname = path.dirname(file); // gets the directory path "/Users/jahanvi/Desktop/healthcare/healthcare-webapp/src/backend/services/functions/verify-user"
      const filename = path.basename(dirname); // gets the last part of the directory path, "verify-user"

      const route = `/${replaceSpecialChars(filename)}`;

      try {
        router.all(route, handler);
      } catch (error) {
        console.warn(`Unable to load file ${relativePath} as a Serverless Function`);
        continue;
      }

      console.log(`Loaded route ${route} from ${relativePath}`);
    } else {
      console.warn(`No default export at ${relativePath}`);
    }
  }

  return router;
};
