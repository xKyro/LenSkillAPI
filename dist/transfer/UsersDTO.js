"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAPIShortUser = toAPIShortUser;
function toAPIShortUser(user) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        account: user.account
    };
}
