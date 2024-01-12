// imports

import express from "express";

//initialize express
const app = express();

//Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
