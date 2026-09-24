import { Suspense } from "react";
import ReservationsComponent from "../components/reservations/ReservationsComponent";
import Spinner from "../components/general/Spinner";


export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner/>}>
            <ReservationsComponent />
        </Suspense>
    )
}