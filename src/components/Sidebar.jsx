import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaMoneyCheckAlt, FaExchangeAlt, FaCog } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import LoadingIndicator from "./common/LoadingIndicator";
import logo from './../assets/images/logo.jpg';
import { HiOutlineLogout } from 'react-icons/hi';
import { logout } from '../utils/logout';
import { useState, useEffect } from "react";

const SideBar = ({ user, isToggle, setToggle }) => {
    const location = useLocation();
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    // Close sidebar when route changes
    useEffect(() => {
        setToggle(false);
    }, [location.pathname, setToggle]);

    const user_links = [
        { name: "Dashboard", path: "investor/dashboard", icon: <FaTachometerAlt /> },
        { name: "Investments", path: "investor/investments", icon: <FaMoneyCheckAlt /> },
        { name: "Copytrade", path: "investor/copy_trades", icon: <FaMoneyCheckAlt /> },
        { name: "Transactions", path: "investor/transactions", icon: <FaMoneyBillTransfer /> },
        { name: "Settings", path: "investor/settings", icon: <FaCog /> },
    ];

    const admin_links = [
        { name: "Dashboard", path: "admin/dashboard", icon: <FaTachometerAlt /> },
        { name: "Manage Users", path: "admin/users", icon: <FaCog /> },
        { name: "Transactions", path: "admin/transactions", icon: <FaExchangeAlt /> },
        { name: "Investments", path: "admin/investments", icon: <FaMoneyCheckAlt /> },
        { name: "Copy Trades", path: "admin/copy_trade", icon: <FaMoneyCheckAlt /> },
        { name: "Copy Trade Investments", path: "admin/copy_trade_investments", icon: <FaMoneyCheckAlt /> },
        // { name: "Settings", path: "admin/settings", icon: <FaCog /> },
    ];

    const role = user.role;
    const links = role === "admin" ? admin_links : user_links;

    // Improved active route detection
    const isActive = (path) => {
        // Remove any trailing slashes for consistent comparison
        const currentPath = location.pathname.replace(/\/+$/, '');
        const targetPath = `/manage/${path}`.replace(/\/+$/, '');
        
        // Exact match or starts with (for nested routes)
        return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    };

    const handleLogout = async () => {
        setProcessing(true);
        try {
            const res = await logout(navigate);
            setProcessing(false);
        } catch (err) {
            setProcessing(false);
            console.log(err);
        }
    };

    return (
        <div
            className={`fixed top-[65px] md:top-0 h-[calc(100vh-65px)] md:h-screen w-56 bg-white dark:bg-slate-800 shadow-lg transition-transform duration-300 ease-in-out transform ${
                isToggle ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } z-40 overflow-y-auto`}
        >
            <div className="flex flex-col lg:h-full  p-3">
                {/* Brand Name */}
                <section className="bg-sky-950 p-3 rounded-md shadow mb-4">
                    <div className="flex items-center flex-col">
                        <img src={logo} alt="Logo" className="h-10" />
                        <h2 className="text-white font-bold text-xs ml-1">InvestmentCrestCapital</h2>
                    </div>
                </section>

                {/* Sidebar Links */}
                <nav className="flex flex-col justify-between flex-grow">
                    <div className="">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                    isActive(link.path)
                                        ? "bg-primary-light text-white font-medium shadow-md"
                                        : "text-slate-700 dark:text-slate-200 hover:bg-primary-light/10 dark:hover:bg-slate-700/80 hover:text-primary-light dark:hover:text-white"
                                }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span>{link.name}</span>
                                {isActive(link.path) && (
                                    <span className="ml-auto w-1.5 h-6 bg-white rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer justify-center gap-2 p-3 mt-4 text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                    >
                        {processing ? (
                            <LoadingIndicator size={5} />
                        ) : (
                            <>
                                <HiOutlineLogout className="h-5 w-5" />
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default SideBar;