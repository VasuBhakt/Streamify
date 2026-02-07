import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function AuthLayout({
    children,
    auth = true,
}) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (auth && authStatus !== auth) {
            navigate("/");
        } else if (!auth && authStatus !== auth) {
            navigate("/home");
        }
        setLoader(false);
    }, [authStatus, navigate, auth]);

    return loader ? <Loading /> : <>{children}</>;
}