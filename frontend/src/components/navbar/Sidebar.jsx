import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../features/uiSlice";
import { NavLink } from "react-router-dom";
import { Home, ThumbsUp, History, Video, Folder, Users, Menu, Settings, HelpCircle } from "lucide-react";
import tw from "../../utils/tailwindUtil";

const SidebarItem = ({ icon: Icon, label, to, isExpanded }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => tw(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group hover:bg-surface-hover",
                isActive ? "bg-primary text-text-main hover:bg-primary-hover" : "text-text-secondary hover:text-text-main",
                !isExpanded && "justify-center px-2"
            )}
        >
            <Icon size={22} strokeWidth={2} />
            <span className={tw(
                "font-medium whitespace-nowrap transition-all duration-200",
                !isExpanded ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}>
                {label}
            </span>

            {!isExpanded && (
                <div className="absolute left-16 px-3 py-1.5 bg-surface text-text-main text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-border">
                    {label}
                </div>
            )}
        </NavLink>
    )
}

const Sidebar = () => {
    const dispatch = useDispatch()
    const { isExpanded } = useSelector((state) => state.ui)

    const mainNavItems = [
        { icon: Home, label: 'Home', to: '/' },
        { icon: ThumbsUp, label: 'Liked Videos', to: '/liked-videos' },
        { icon: History, label: 'History', to: '/history' },
        { icon: Video, label: 'My Content', to: `/c` },
        { icon: Users, label: 'Dashboard', to: '/dashboard' }
    ]

    const bottomNavItems = [
        { icon: Settings, label: 'Settings', to: '/settings' },
        { icon: HelpCircle, label: 'Support', to: '/support' }
    ]

    return (
        <>
            <aside className={tw(
                "fixed left-0 top-0 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out z-40 flex flex-col",
                isExpanded ? "w-64" : "w-20"
            )}>
                <div className="h-16 flex items-center px-4 border-b border-border">
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 hover:bg-surface-hover rounded-lg text-text-secondary hover:text-text-main transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className={tw(
                        "ml-3 font-bold text-xl text-text-main flex items-center gap-2 overflow-hidden transition-all duration-300",
                        !isExpanded ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        <span className="text-primary">Stream</span>ify
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            isExpanded={isExpanded}
                        />
                    ))}
                </div>

                <div className="p-3 border-t border-border space-y-1">
                    {bottomNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            isExpanded={isExpanded}
                        />
                    ))}
                </div>
            </aside>
            <div className={tw(
                "transition-all duration-300 ease-in-out",
                isExpanded ? "ml-64" : "ml-20"
            )} />
        </>
    )
}

export default Sidebar
