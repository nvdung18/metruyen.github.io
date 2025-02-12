"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyOneFieldValidator = void 0;
const class_validator_1 = require("class-validator");
let OnlyOneFieldValidator = class OnlyOneFieldValidator {
    validate(value, args) {
        const dto = args.object;
        const fields = args.constraints;
        const chosenFields = fields.filter((field) => dto[field]);
        return chosenFields.length <= 1;
    }
    defaultMessage(args) {
        return 'Only one of updatedAt, createdAt, manga_views, or manga_number_of_followers can be set.';
    }
};
exports.OnlyOneFieldValidator = OnlyOneFieldValidator;
exports.OnlyOneFieldValidator = OnlyOneFieldValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'OnlyOneSortField', async: false })
], OnlyOneFieldValidator);
//# sourceMappingURL=only-one-field.validator.js.map