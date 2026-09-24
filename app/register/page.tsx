import { Suspense } from "react";
import RegisterComponent from "../components/general/RegisterComponent";
import Spinner from "../components/general/Spinner";


export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner/>}>
            <RegisterComponent />
        </Suspense>
    )
}