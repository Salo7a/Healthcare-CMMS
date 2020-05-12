const express = require("express");
const router = express.Router();
const isAuth = require("../utils/filters").isAuth;
const personnel = require("../models").Indoor;
const departments = require("../models").Department;
const user = require("../models").User;
