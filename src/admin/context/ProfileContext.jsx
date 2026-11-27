import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { profileAPI } from "../api/profileapi.js";


const ProfileContext = createContext(null);
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within ProfileProvider");
    }
    return context;
};
export const ProfileProvider = ({ children }) => {
    const initialAdmin = (() => {
        try {
            return JSON.parse(localStorage.getItem("admin") || "{}");
        } catch {
            return {};
        }
    })();

    const [profile, setProfile] = useState(initialAdmin);
    const [email, setEmail] = useState(initialAdmin.email || "");
    const [role, setrole] = useState(initialAdmin.role || "Admin");
    const [username, setusername] = useState(initialAdmin.full_name || initialAdmin.username || "Admin");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get admin info from localStorage
    const getAdminInfo = () => {
        const adminRaw = localStorage.getItem("admin");
        const token = localStorage.getItem("token");
        const admin = adminRaw ? JSON.parse(adminRaw) : null;
        return { adminId: admin?.id, token, admin };
    };

    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        const { adminId, token, admin } = getAdminInfo();
        if (!adminId || !token) return;

        try {
            setLoading(true);
            setError(null);
            const data = await profileAPI.getProfile(adminId);
            const resolvedProfile = data.admin || data.data || data || {};
            setProfile(resolvedProfile);
            setEmail(resolvedProfile.email || admin?.email || "");
            setrole(resolvedProfile.role || admin?.role || "Admin");
            const resolvedName =
                resolvedProfile.full_name ||
                resolvedProfile.name ||
                resolvedProfile.username ||
                (resolvedProfile.profile?.firstName
                    ? `${resolvedProfile.profile.firstName} ${resolvedProfile.profile.lastName || ""}`.trim()
                    : "") ||
                admin?.full_name ||
                admin?.username ||
                "Admin";
            setusername(resolvedName);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch profile");
            console.error("Profile fetch error:", err);
            if (admin?.full_name || admin?.username) {
                setusername(admin.full_name || admin.username);
                setrole(admin.role || "Admin");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Update profile
    const updateProfile = async (formData) => {
        const { adminId } = getAdminInfo();
        if (!adminId) throw new Error("Admin ID not found");

        try {
            setLoading(true);
            setError(null);
            const data = await profileAPI.updateProfile(adminId, formData);
            setProfile(data.profile || {});
            setEmail(data.email || "");
            return { success: true, data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to update profile";
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const changePassword = async (passwordData) => {
        const { adminId } = getAdminInfo();
        if (!adminId) throw new Error("Admin ID not found");

        try {
            setLoading(true);
            setError(null);
            await profileAPI.changePassword(adminId, passwordData);
            await fetchProfile(); 
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to change password";
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const value = {
        profile,
        email,
        loading,
        error,
        role,
        username,
        fetchProfile,
        updateProfile,
        changePassword,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};