"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMsgType = void 0;
var EMsgType;
(function (EMsgType) {
    EMsgType[EMsgType["EVENT"] = 0] = "EVENT";
    EMsgType[EMsgType["COMMAND"] = 1] = "COMMAND";
    EMsgType[EMsgType["RESULT"] = 2] = "RESULT";
    EMsgType[EMsgType["PROGRESS"] = 3] = "PROGRESS";
    EMsgType[EMsgType["FLOWCONTROL"] = 4] = "FLOWCONTROL";
})(EMsgType = exports.EMsgType || (exports.EMsgType = {}));
