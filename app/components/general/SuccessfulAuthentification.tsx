import { Check } from "lucide-react";

export default function SuccessfulAuthentification({ authType }: { authType: string }) {
    const label = authType === "Login" ? "¡Inicio de sesión exitoso!" : "¡Registro completado exitosamente!";

    return (
        <div className="flex items-center bg-emerald-600 text-white shadow-lg fixed p-4 rounded-xl top-24 z-50 animate-bounce">
            <Check className="w-5 h-5" />
            <span className="text-base font-semibold ml-3">{label} Redirigiendo...</span>
        </div>
    );
}