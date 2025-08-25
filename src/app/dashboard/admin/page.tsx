"use client";
import { useEffect, useState } from "react";
import API from "../../../../lib/api";
import { useRouter } from "next/navigation";

interface Stats {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    address: string;
    role: string;
    rating?: number;
}

interface Store {
    id: number;
    name: string;
    email: string;
    address: string;
    rating: number;
}

type ActiveTab = 'dashboard' | 'users' | 'stores' | 'addUser' | 'addStore';

export default function EnhancedAdminDashboard() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'stores') {
            fetchStores();
        }
    }, [activeTab, searchTerm, sortBy, sortOrder]);

    const fetchStats = async () => {
        try {
            const response = await API.get("/admin/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await API.get(`/admin/users?search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await API.get(`/admin/stores?search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            setStores(response.data);
        } catch (error) {
            console.error("Failed to fetch stores:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar */}
                <nav className="w-64 bg-white shadow-sm min-h-screen">
                    <div className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'dashboard'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'users'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    View Users
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('stores')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'stores'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    View Stores
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('addUser')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'addUser'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Add User
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('addStore')}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === 'addStore'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Add Store
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {activeTab === 'dashboard' && (
                        <DashboardView stats={stats} />
                    )}
                    {activeTab === 'users' && (
                        <UsersView
                            users={users}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        />
                    )}
                    {activeTab === 'stores' && (
                        <StoresView
                            stores={stores}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        />
                    )}
                    {activeTab === 'addUser' && (
                        <AddUserView onSuccess={() => {
                            setActiveTab('users');
                            fetchUsers();
                        }} />
                    )}
                    {activeTab === 'addStore' && (
                        <AddStoreView onSuccess={() => {
                            setActiveTab('stores');
                            fetchStores();
                        }} />
                    )}
                </main>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <PasswordChangeModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={() => {
                        setShowPasswordModal(false);
                        alert("Password updated successfully");
                    }}
                />
            )}
        </div>
    );
}

// Dashboard View Component
function DashboardView({ stats }: { stats: Stats | null }) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">👥</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">🏪</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Stores</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalStores || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">⭐</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalRatings || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Users View Component
function UsersView({
    users,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    onSort
}: {
    users: User[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: string;
    sortOrder: string;
    onSort: (field: string) => void;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
                <div className="w-80">
                    <input
                        type="text"
                        placeholder="Search by name, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('name')}
                                >
                                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('email')}
                                >
                                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('address')}
                                >
                                    Address {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('role')}
                                >
                                    Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {user.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                            ? 'bg-red-100 text-red-800'
                                            : user.role === 'store_owner'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'store_owner' && user.rating ?
                                            `${parseFloat(user.rating.toString()).toFixed(1)}/5` :
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}

// Stores View Component
function StoresView({
    stores,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    onSort
}: {
    stores: Store[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: string;
    sortOrder: string;
    onSort: (field: string) => void;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Stores Management</h2>
                <div className="w-80">
                    <input
                        type="text"
                        placeholder="Search by name, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('name')}
                                >
                                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('email')}
                                >
                                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('address')}
                                >
                                    Address {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('rating')}
                                >
                                    Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {store.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {store.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-sm ${i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {parseFloat(store.rating.toString()).toFixed(1)}/5
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {stores.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No stores found.
                    </div>
                )}
            </div>
        </div>
    );
}

// Add User View Component
function AddUserView({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await API.post("/admin/users", formData);
            alert("User created successfully");
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.errors?.join(', ') || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Add New User</h2>

            <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">20-60 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                8-16 characters with uppercase and special character
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum 400 characters</p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                        <button
                            type="button"
                            onClick={onSuccess}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Add Store View Component
function AddStoreView({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerEmail: "",
        ownerPassword: "",
        createOwner: false
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const submitData = {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                ...(formData.createOwner && {
                    ownerEmail: formData.ownerEmail,
                    ownerPassword: formData.ownerPassword
                })
            };

            await API.post("/admin/stores", submitData);
            alert("Store created successfully");
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create store");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Add New Store</h2>

            <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">20-60 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Store Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="createOwner"
                                checked={formData.createOwner}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Create store owner account</span>
                        </label>
                    </div>

                    {formData.createOwner && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner Email *
                                </label>
                                <input
                                    type="email"
                                    name="ownerEmail"
                                    value={formData.ownerEmail}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required={formData.createOwner}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner Password *
                                </label>
                                <input
                                    type="password"
                                    name="ownerPassword"
                                    value={formData.ownerPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required={formData.createOwner}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    8-16 characters with uppercase and special character
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Creating..." : "Create Store"}
                        </button>
                        <button
                            type="button"
                            onClick={onSuccess}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Password Change Modal Component
function PasswordChangeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await API.put("/users/password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            8-16 characters with at least one uppercase letter and one special character
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}