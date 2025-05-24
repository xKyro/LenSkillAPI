"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const profile_controller_1 = require("../controllers/profile.controller");
const profileRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
profileRouter.get("/", sessionTokenValidation_1.validateSession, profile_controller_1.getProfile);
profileRouter.get("/courses", sessionTokenValidation_1.validateSession, profile_controller_1.getProfileCourses);
exports.default = profileRouter;
