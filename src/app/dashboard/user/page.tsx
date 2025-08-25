"use client";
import { useEffect, useState } from "react";
import API from "../../../../lib/api";
import { useRouter } from "next/navigation";
import RoleToggle from "@/app/components/RoleToggle";

interface Store {
    id: number;
    name: string;
    address: string;
    rating: number;
    user_rating: number | null;
}

export default function UserDashboardWithToggle() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchStores();
    }, [searchTerm]);

    const fetchStores = async () => {
        try {
            setError("");
            const response = await API.get(`/stores?search=${searchTerm}`);
            setStores(response.data);
        } catch (error: any) {
            console.error("Failed to fetch stores:", error);
            setError(error.response?.data?.error || "Failed to load stores");
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (storeId: number, rating: number) => {
        try {
            setError("");
            await API.post("/ratings", { storeId, rating });
            fetchStores(); // Refresh the stores list
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Failed to submit rating";
            setError(errorMsg);
            alert(errorMsg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
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
                    <h1 className="text-2xl font-bold text-gray-900">Store Directory</h1>
                    <div className="flex items-center gap-4">
                        {/* Role Toggle */}
                        <RoleToggle currentRole="user" />

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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="max-w-md">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search Stores
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by store name or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Debug Info */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                        <strong>Debug:</strong> Current role: {localStorage.getItem("role") || "Not set"} |
                        Token exists: {localStorage.getItem("token") ? "Yes" : "No"}
                    </p>
                </div>

                {/* Stores Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onRating={handleRating}
                        />
                    ))}
                </div>

                {stores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {searchTerm ? `No stores found matching "${searchTerm}"` : "No stores available"}
                        </div>
                    </div>
                )}
            </main>

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

// Store Card Component
function StoreCard({
    store,
    onRating
}: {
    store: Store;
    onRating: (storeId: number, rating: number) => void
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingClick = async (rating: number) => {
        setIsSubmitting(true);
        try {
            await onRating(store.id, rating);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
                {/* Store Info */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {store.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                        📍 {store.address}
                    </p>
                </div>

                {/* Ratings Display */}
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                            Overall Rating:
                        </span>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-lg ${i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                                ({parseFloat(store.rating.toString()).toFixed(1)})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                            Your Rating:
                        </span>
                        <span className="text-sm text-gray-600">
                            {store.user_rating ? `${store.user_rating}/5` : "Not rated yet"}
                        </span>
                    </div>
                </div>

                {/* Rating Buttons */}
                <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Rate this store:
                    </p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleRatingClick(rating)}
                                disabled={isSubmitting}
                                className={`w-10 h-10 rounded-md border transition-colors ${store.user_rating === rating
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Click a number to rate (you can change your rating anytime)
                    </p>
                </div>
            </div>
        </div>
    );
}

// Password Change Modal Component
function PasswordChangeModal({
    onClose,
    onSuccess
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
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