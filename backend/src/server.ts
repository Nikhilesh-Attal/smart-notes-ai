import dotenv from "dotenv"
dotenv.config()

import app from './app';

import fs from "fs";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});