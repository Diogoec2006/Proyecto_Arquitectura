"use client";
import Link from "next/link";

export default function LoginButton() {
    return (
        <Link 
            href="/login" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2 rounded-full transition-all shadow-xs"
        >
            Iniciar Sesión
        </Link>
    );
}