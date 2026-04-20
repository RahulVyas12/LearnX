import React, { useState } from 'react';
import { Outlet } from 'react-router';
// We will create these shortly
import AdminSideBar from './AdminSideBar';
import AdminTopBar from './AdminTopBar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-['Plus_Jakarta_Sans']">
            {/* Sidebar */}
            <AdminSideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex w-full flex-col lg:ml-72 transition-all duration-300">
                {/* Top Navbar */}
                <AdminTopBar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
