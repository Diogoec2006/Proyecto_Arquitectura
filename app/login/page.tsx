import { Suspense } from "react";
import LoginComponent from "../components/general/LoginComponent";
import Spinner from "../components/general/Spinner";

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner/>}>
            <LoginComponent />
        </Suspense>
    )
}