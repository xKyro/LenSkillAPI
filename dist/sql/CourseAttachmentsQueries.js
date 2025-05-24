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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCourseAttachment = uploadCourseAttachment;
exports.fetchCourseAttachment = fetchCourseAttachment;
exports.fetchCourseAttachments = fetchCourseAttachments;
exports.deleteCourseAttachment = deleteCourseAttachment;
const Database_1 = __importDefault(require("../schemas/Database"));
const Attachments_1 = require("../tools/Attachments");
const Connection_1 = require("../tools/Connection");
function uploadCourseAttachment(attachment, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const connection = __addDisposableResource(env_1, yield (0, Connection_1.getClient)(Database_1.default), false);
            const { client } = connection;
            try {
                yield client.query("begin");
                const result = yield client.query(`insert into course_attachments (attachment_id, name, mimetype, course_id) values ($1, $2, $3, $4) returning *`, [attachment.id, attachment.name, attachment.mimetype, attachment.course_id]).then(r => r.rows[0]);
                if (!result)
                    return null;
                const dataQueue = [];
                for (const adata of data) {
                    dataQueue.push(client.query(`insert into course_attachment_data (attachment_id, buffer, chunk_index) values ($1, $2, $3)`, [result.attachment_id, adata.buffer, adata.chunk_index]));
                }
                yield Promise.all(dataQueue);
                yield client.query("commit");
                return attachment;
            }
            catch (err) {
                yield client.query("rollback");
                console.log(err);
                return null;
            }
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    });
}
function fetchCourseAttachment(attachmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from course_attachments a join course_attachment_data ad on ad.attachment_id = a.attachment_id where a.attachment_id = $1 
        order by ad.chunk_index asc;`, [attachmentId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const attachment = {
            id: data.attachment_id,
            name: data.name,
            mimetype: data.mimetype,
            buffer: (0, Attachments_1.unifyAttachmentData)(result.rows.map(d => {
                return { attachment_id: d.attachment_id, buffer: d.buffer, chunk_index: d.chunk_index };
            }))
        };
        return attachment;
    });
}
function fetchCourseAttachments(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const attachmentUrls = [];
        const result = yield Database_1.default.query(`select * from course_attachments where course_id = $1`, [courseId]);
        if (!result.rows[0])
            return [];
        for (const data of result.rows) {
            const attachment = {
                name: data.name,
                url: `${process.env.API_URL}/api/v1/attachments/courses/${data.attachment_id}`
            };
            attachmentUrls.push(attachment);
        }
        return attachmentUrls;
    });
}
function deleteCourseAttachment(attachmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from course_attachments where attachment_id = $1 returning *`, [attachmentId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const attachmentDTO = {
            id: data.attachment_id,
            name: data.name,
            mimetype: data.mimetype,
            course_id: data.course_id
        };
        return attachmentDTO;
    });
}
