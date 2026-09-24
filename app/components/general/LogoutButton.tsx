"use client";

import { useState } from "react";

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <button 
            disabled={isLoading} 
            onClick={handleLogout} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-6 py-2 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
        >
            {isLoading ? "Cerrando..." : "Cerrar Sesión"}
        </button>
    );
}