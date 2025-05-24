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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProfile = fetchProfile;
const Database_1 = __importDefault(require("../schemas/Database"));
const DateFormatter_1 = require("../tools/DateFormatter");
const UserQueries_1 = require("./UserQueries");
function fetchProfile(userId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from users where user_id = $1`, [userId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const userDTO = {
            id: data.user_id,
            first_name: data.first_name,
            last_name: data.last_name,
            credentials: {
                email: data.email,
                password: data.password
            },
            account: {
                role: data.role,
                created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
                last_login: (0, DateFormatter_1.formatToLocale)(data.last_login)
            }
        };
        if (options === null || options === void 0 ? void 0 : options.getCourses) {
            const courses = yield (0, UserQueries_1.fetchUserCourses)(userId);
            userDTO.courses = courses;
        }
        if (options === null || options === void 0 ? void 0 : options.getSubmissions) {
            const submissions = yield (0, UserQueries_1.fetchUserSubmissions)(userId);
            userDTO.submissions = submissions;
        }
        return userDTO;
    });
}
