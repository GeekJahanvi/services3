/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import loader from './helpers/loader';

const port = 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json());

// App Routes
(async () => {
  // Loading Functions...
  app.use(await loader('functions'));
})();

// App Listen
app.listen(port, () => {
  console.log(`Action listening on port ${port}`);
});
