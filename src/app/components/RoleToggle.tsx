"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RoleToggleProps {
    currentRole?: string;
    className?: string;
}

export default function RoleToggle({ currentRole, className = "" }: RoleToggleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const roles = [
        {
            value: 'user',
            label: 'User',
            path: '/dashboard/user',
            color: 'bg-green-500',
            credentials: { email: 'user@test.com', password: 'Test123!' }
        },
        {
            value: 'admin',
            label: 'Admin',
            path: '/dashboard/admin',
            color: 'bg-red-500',
            credentials: { email: 'admin@admin.com', password: 'Admin123!' }
        },
        {
            value: 'store_owner',
            label: 'Store Owner',
            path: '/dashboard/owner',
            color: 'bg-blue-500',
            credentials: { email: 'owner@test.com', password: 'Owner123!' }
        }
    ];

    const switchRole = (role: typeof roles[0]) => {
        // Update localStorage with new role
        localStorage.setItem("role", role.value);

        // For demo purposes, we'll create a mock token
        // In real app, you'd need to actually authenticate
        const mockToken = btoa(JSON.stringify({
            id: role.value === 'admin' ? 1 : role.value === 'store_owner' ? 2 : 3,
            role: role.value,
            exp: Date.now() + 86400000 // 24 hours
        }));

        localStorage.setItem("token", mockToken);

        // Navigate to appropriate dashboard
        router.push(role.path);
        setIsOpen(false);
    };

    const getCurrentRole = () => {
        const role = currentRole || localStorage.getItem("role") || 'user';
        return roles.find(r => r.value === role) || roles[0];
    };

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={`w-2 h-2 rounded-full ${getCurrentRole().color} mr-2 mt-1.5`}></span>
                    {getCurrentRole().label}
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                Switch Role (Demo)
                            </div>
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => switchRole(role)}
                                    className={`group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${getCurrentRole().value === role.value ? 'bg-gray-50' : ''
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${role.color} mr-3`}></span>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">{role.label}</div>
                                        <div className="text-xs text-gray-500">
                                            {role.credentials.email}
                                        </div>
                                    </div>
                                    {getCurrentRole().value === role.value && (
                                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="py-1">
                            <div className="px-4 py-2 text-xs text-gray-400">
                                💡 This is a demo toggle for testing purposes
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}