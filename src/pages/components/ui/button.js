"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
var jsx_runtime_1 = require("react/jsx-runtime");
var class_variance_authority_1 = require("class-variance-authority");
var clsx_1 = __importDefault(require("clsx"));
var buttonStyles = (0, class_variance_authority_1.cva)("inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed interactive relative overflow-hidden", {
    variants: {
        variant: {
            primary: "bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-glow hover:shadow-glow/80 fab",
            secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 shadow-soft",
            ghost: "bg-transparent text-slate-600 hover:bg-white/50 hover:text-slate-800",
            outline: "border-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600 backdrop-blur-sm",
            success: "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-glow",
            warning: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-soft",
            danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-soft",
        },
        size: {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-12 px-8 text-base",
            xl: "h-14 px-10 text-lg",
        },
    },
    defaultVariants: { variant: "primary", size: "md" },
});
function Button(_a) {
    var className = _a.className, variant = _a.variant, size = _a.size, props = __rest(_a, ["className", "variant", "size"]);
    return (0, jsx_runtime_1.jsx)("button", __assign({ className: (0, clsx_1.default)(buttonStyles({ variant: variant, size: size }), className) }, props));
}
