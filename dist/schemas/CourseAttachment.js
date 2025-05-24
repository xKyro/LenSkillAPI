"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignID_1 = require("../tools/SignID");
class CourseAttachment {
    constructor(options) {
        this.id = (0, SignID_1.getLongSnowflake)();
        this.name = options.name;
        this.mimetype = options.mimetype;
        this.course_id = options.course_id;
    }
}
exports.default = CourseAttachment;
