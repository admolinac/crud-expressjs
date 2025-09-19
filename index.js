
const express = require('express');
const { query, validationResult } = require('express-validator');
const logger = require('./logger');

const app = express();

app.use(express.json());

app.use(logger);