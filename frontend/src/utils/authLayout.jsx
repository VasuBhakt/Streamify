import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
    children,
    auth = true,
}) {

    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (auth && authStatus !== auth) {
            navigate('/');
        } else if (!auth && authStatus !== auth) {
            navigate('/home');
        }
        setLoader(false);
    }, [authStatus, navigate, auth])

    return loader ? <div className="flex h-screen w-full items-center justify-center">Loading...</div> : <>{children}</>;
}