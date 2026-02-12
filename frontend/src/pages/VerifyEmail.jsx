import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/auth";
import Button from "../components/button/Button";
import { ShieldCheck, AlertCircle, Loader2, Mail } from "lucide-react";

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ type: "loading", message: "Verifying your email..." });

    // for react strict mode
    const hasExecuted = useRef(false);

    useEffect(() => {
        if (hasExecuted.current) return;

        const verify = async () => {
            try {
                const response = await authService.verifyEmail(token);
                if (response) {
                    setStatus({
                        type: "success",
                        message: "Email verified successfully! You can now log in to your account."
                    });
                }
            } catch (error) {
                setStatus({
                    type: "error",
                    message: error.response?.data?.message || "Verification link is invalid or has expired."
                });
            }
        };

        if (token) {
            hasExecuted.current = true;
            verify();
        } else {
            setStatus({
                type: "error",
                message: "No verification token found."
            });
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full">
                <div className="bg-surface border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative backdrop-blur-sm">
                    <div className="text-center mb-10">
                        <div className={`inline-flex p-3 rounded-2xl mb-6 ${status.type === "loading" ? "bg-primary/10 text-primary animate-pulse" :
                            status.type === "success" ? "bg-success/10 text-success" :
                                "bg-error/10 text-error"
                            }`}>
                            {status.type === "loading" ? <Loader2 size={28} className="animate-spin" /> :
                                status.type === "success" ? <ShieldCheck size={28} /> :
                                    <AlertCircle size={28} />}
                        </div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight mb-2 flex items-center justify-center gap-2">
                            Email Verification
                        </h1>
                        <p className="text-text-secondary font-medium">
                            {status.type === "loading" ? "Please wait while we confirm your identity." :
                                status.type === "success" ? "Your account is now fully activated!" :
                                    "There was a problem verifying your account."}
                        </p>
                    </div>

                    <div className={`p-6 rounded-2xl flex flex-col items-center gap-4 text-center ${status.type === "success" ? "bg-success/5 border border-success/10" :
                        status.type === "error" ? "bg-error/5 border border-error/10" :
                            "bg-primary/5 border border-primary/10"
                        }`}>
                        <div className={`font-bold ${status.type === "success" ? "text-success" :
                            status.type === "error" ? "text-error" :
                                "text-primary"
                            }`}>
                            {status.message}
                        </div>

                        {status.type === "success" && (
                            <Button
                                onClick={() => navigate("/login")}
                                variant="primary"
                                className="w-full mt-2 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Continue to Login
                            </Button>
                        )}

                        {status.type === "error" && (
                            <Button
                                onClick={() => navigate("/register")}
                                variant="danger"
                                className="w-full mt-2 py-4 rounded-2xl font-black text-lg border-border/50 hover:bg-error-hover transition-all"
                            >
                                Register Again
                            </Button>
                        )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-border/30 text-center">
                        <div className="flex items-center justify-center gap-2 text-text-muted text-sm font-medium">
                            <Mail size={16} />
                            <span>Questions? Email {import.meta.env.VITE_SUPPORT_EMAIL}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
