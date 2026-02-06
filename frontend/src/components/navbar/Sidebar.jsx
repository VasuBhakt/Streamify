import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Home, LogIn, ThumbsUp, History, Video, Folder, Users, Menu, Settings, HelpCircle } from "lucide-react";
import tw from "../../utils/tailwindUtil";

const SidebarItem = ({ icon: Icon, label, to, isExpanded }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => tw(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group hover:bg-surface-hover",
                isActive ? "bg-primary text-text-main hover:bg-secondary-hover" : "text-text-secondary hover:text-text-main",
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
    const { isExpanded } = useSelector((state) => state.ui)
    const { userData: user, status } = useSelector((state) => state.auth)


    const mainNavItems = [
        { icon: Home, label: 'Home', to: '/' },
        { icon: Folder, label: 'Subscriptions', to: '/subscriptions' },
        { icon: ThumbsUp, label: 'Liked Videos', to: '/liked-videos' },
        { icon: History, label: 'History', to: '/history' },
        { icon: Video, label: 'My Content', to: user ? `/c/${user.username}` : '/login' },
        { icon: Users, label: 'Dashboard', to: '/dashboard' }
    ]

    const bottomNavItems = [
        { icon: Settings, label: 'Settings', to: '/settings' },
        { icon: HelpCircle, label: 'Support', to: '/support' }
    ]

    return (
        <>
            <aside className={tw(
                "fixed left-0 top-16 h-[calc(100vh-64px)] bg-background border-r border-none transition-all duration-300 ease-in-out z-40 flex flex-col",
                isExpanded ? "w-64" : "w-20"
            )}>

                {status && (<div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            isExpanded={isExpanded}
                        />
                    ))}
                </div>)}

                {!status && (
                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                        <SidebarItem icon={Home} key="/" label="Home" to="/" isExpanded={isExpanded} />
                        <SidebarItem icon={LogIn} key="/login" label="Login" to="/login" isExpanded={isExpanded} />
                    </div>
                )}

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
                "transition-all duration-300 ease-in-out shrink-0",
                isExpanded ? "w-64" : "w-20"
            )} />
        </>
    )
}

export default Sidebar
