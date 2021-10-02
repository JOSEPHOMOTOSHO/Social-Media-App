"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const template_1 = __importDefault(require("../template"));
var router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
    res.status(200).send((0, template_1.default)());
});
exports.default = router;
//# sourceMappingURL=index.js.map