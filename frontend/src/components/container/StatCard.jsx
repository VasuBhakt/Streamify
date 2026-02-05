import tw from "../../utils/tailwindUtil";
import { Icon } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div
        onClick={onClick}
        className={tw(
            "bg-surface/10 rounded-3xl p-6 border border-border/40 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300",
            onClick && "cursor-pointer active:scale-95"
        )}
    >
        <div className={tw("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg", color)}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-black text-text-main mt-1 tracking-tight">{value}</h3>
        </div>
    </div>
);

export default StatCard;
