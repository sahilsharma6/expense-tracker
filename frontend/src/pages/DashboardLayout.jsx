// import { useAuth } from "../hooks/useAuth";
import { LogOut, User, BarChart3, FileText, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function DashboardLayout({ children }) {
  const { user, signOut } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: "Expenses", href: "/expenses", icon: FileText },
    ...(user?.role === "admin"
      ? [
          { name: "Dashboard", href: "/dashboard  ", icon: BarChart3 },
          { name: "Audit Logs", href: "/audit", icon: Settings },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <span className="text-xl font-bold text-gray-900">
              Expense Tracker
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
            >
              &#10005;
            </button>
          </div>
          <nav className="flex-1 px-6 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4 border-t flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.email}</p>
              <p className="text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={signOut}
              className="ml-auto p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Top Nav */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-co sm:flex-row justify-between items-center h-auto sm:h-16 py-2 sm:py-0">
            {/* Hamburger for mobile */}
            <div className="flex items-center sm:hidden logo">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Expense Tracker
              </Link>
            </div>
            <button
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Desktop Nav */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8 w-full">
              <h1 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                Expense Tracker
              </h1>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 w-full sm:w-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className=" hidden sm:flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.email}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
