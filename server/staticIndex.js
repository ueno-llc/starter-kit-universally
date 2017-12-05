/*
    Naively simple entry point that can be used in conjunction with the static site
    generation to serve the pre-generated routes via express.static
 */

/* eslint-disable no-console */
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const staticDir = path.join(__dirname, '../build/static');

app.use(express.static(staticDir));
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Static site listening on port: ${port}`);
  }
});
