import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/auth";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import { Lock, Sparkles, ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setStatus({ type: "", message: "" });

            const response = await authService.resetPassword(token, data.password);
            if (response) {
                setStatus({
                    type: "success",
                    message: "Password reset successful. Redirecting to login..."
                });
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: error.response?.data?.message || "Invalid or expired token."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full">
                <div className="bg-surface border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative backdrop-blur-sm">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-3 rounded-2xl bg-success/10 text-success mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight mb-2 flex items-center justify-center gap-2">
                            New Password
                        </h1>
                        <p className="text-text-secondary font-medium">
                            Set a strong password for your account.
                        </p>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${status.type === "success"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-error/10 text-error border border-error/20"
                            }`}>
                            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.password?.message}
                            rightElement={
                                <button
                                    type="button"
                                    className="p-1 text-text-muted hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            }
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" }
                            })}
                        />

                        <Input
                            label="Confirm New Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword", {
                                required: "Please confirm password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-text-muted">
                            Remembered your password?{" "}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
