"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.getProfileCourses = getProfileCourses;
const ProfileQueries_1 = require("../sql/ProfileQueries");
const UserQueries_1 = require("../sql/UserQueries");
function getProfile(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { gc, gs } = request.query;
            const user = yield (0, ProfileQueries_1.fetchProfile)(me.id, {
                getCourses: !!(+gc),
                getSubmissions: !!(+gs),
            });
            if (!user)
                return response.status(404).send({ message: `User not found.` });
            response.status(200).send({ message: `User profile fetched.`, user });
        }
        catch (err) {
            response.status(500).send({ message: `An error ocurred on our end.`, error: err.message });
        }
    });
}
function getProfileCourses(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const courses = yield (0, UserQueries_1.fetchUserCourses)(me.id);
            response.status(200).send({ message: `User profile courses fetched.`, courses });
        }
        catch (err) {
            response.status(500).send({ message: `An error ocurred on our end.`, error: err.message });
        }
    });
}
