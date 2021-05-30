const express = require('express');
const app = express();
const port = 4009;    //'4009'

app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen(port, () => {
  console.log(`Port is listening at: ${port}`);
});