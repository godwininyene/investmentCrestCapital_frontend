import Headerbar from '../components/Headerbar';
import SideBar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function AuthenticatedLayout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [toggle, setToggle] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 dark:text-slate-200">
            {/* Sidebar */}
            <SideBar user={user} isToggle={toggle} setToggle={setToggle}/>

            {/* Main Content */}
            <div className="md:ml-56 min-h-full relative">
                {/* Header */}
                <Headerbar toggle={setToggle} isToggle={toggle} user={user} />

                {/* Main Content Area */}
                <main className="py-6 md:py-4 px-4  text-slate-800 dark:text-slate-300 relative z-0 pb-20 md:pb-10 overflow-x-auto mt-[64px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}