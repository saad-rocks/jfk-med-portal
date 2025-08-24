import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export function Card(props) {
    const { className, ...rest } = props;
    return _jsx("div", { className: clsx("glass rounded-3xl border border-white/30 p-6 shadow-soft hover:shadow-glow transition-all duration-300 interactive group", className), ...rest });
}
export function CardHeader(props) {
    const { className, ...rest } = props;
    return _jsx("div", { className: clsx("mb-6 pb-3", className), ...rest });
}
export function CardTitle(props) {
    const { className, ...rest } = props;
    return _jsx("h3", { className: clsx("text-lg font-bold text-slate-800 tracking-tight leading-tight", className), ...rest });
}
export function CardContent(props) {
    const { className, ...rest } = props;
    return _jsx("div", { className: clsx("text-sm text-slate-600 leading-relaxed", className), ...rest });
}
