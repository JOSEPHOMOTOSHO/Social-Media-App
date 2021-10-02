"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
mongoose_1.default.connect(config_1.default.mongoUri)
    .then(() => console.log('The database have been Connected'))
    .catch((err) => console.log(`DB Connection Error${err}`));
mongoose_1.default.connection.on('error', (err) => {
    throw new Error(`unable to connect ${config_1.default.mongoUri} and the error is ${err.message}`);
});
//# sourceMappingURL=database.js.map