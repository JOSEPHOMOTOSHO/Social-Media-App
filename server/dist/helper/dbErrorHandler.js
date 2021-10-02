"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//added this part coz it was added in the book.. i really dont understand it yet
const getUniqueErrorMessage = (err) => {
    let output;
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf(".$") + 2, err.message.lastIndexOf("_1"));
        // console.log(err.message)
        output =
            fieldName.charAt(0).toUpperCase() +
                fieldName.slice(1) +
                " already exists";
    }
    catch (ex) {
        output = "Unique field already exists";
    }
    return output;
};
const getErrorMessage = (err) => {
    let message = "";
    if (err.code) {
        console.log('err.code', err.code);
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = "Something went wrong";
        }
    }
    else {
        for (let errName in err.errors) {
            console.log(err.errors);
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};
exports.default = { getErrorMessage };
//# sourceMappingURL=dbErrorHandler.js.map