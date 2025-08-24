import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export function Input(props) {
    const { className, ...rest } = props;
    return (_jsx("input", { className: clsx("w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500", className), ...rest }));
}
