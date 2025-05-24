"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE = exports.BLACKLISTED_MIMETYPES = exports.MAX_ATTACHMENT_BUFFER_SIZE = exports.MAX_ATTACHMENT_UPLOAD_SIZE = exports.ACTIVITY_DEADLINE_WINDOW = exports.TOKEN_EXPIRATION_TIME = void 0;
const AttachmentCache_1 = __importDefault(require("./cache/AttachmentCache"));
exports.TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;
//D * H * M * S * MS
exports.ACTIVITY_DEADLINE_WINDOW = 1 * 24 * 60 * 60 * 1000;
//GB * MB * KB * B
exports.MAX_ATTACHMENT_UPLOAD_SIZE = 50 * 1024 * 1024;
exports.MAX_ATTACHMENT_BUFFER_SIZE = 5 * 1024 * 1024;
exports.BLACKLISTED_MIMETYPES = [
    'application/x-msdownload', // .exe
    'application/x-msdos-program',
    'application/x-sh', // shell script
    'application/x-bash',
    'application/x-csh',
    'application/x-python',
    'application/x-php',
    'application/x-perl',
    'application/x-ruby',
    'application/java-archive', // .jar
    'application/x-msinstaller'
];
exports.CACHE = new AttachmentCache_1.default({
    maxSize: 32,
    timeLimit: 120 //Seconds
});
