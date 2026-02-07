import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import authService from "../services/auth";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import { Mail, ArrowLeft, Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setStatus({ type: "", message: "" });

            const response = await authService.forgotPassword(data.email);
            if (response) {
                setStatus({
                    type: "success",
                    message: "Check your inbox for the password reset link."
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: error.response?.data?.message || "Something went wrong. Please try again."
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
                        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6">
                            <Send size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight mb-2 flex items-center justify-center gap-2">
                            Reset Password <Sparkles size={20} className="text-primary" />
                        </h1>
                        <p className="text-text-secondary font-medium">
                            Enter your email and we'll send you a link to reset your password.
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
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Invalid email address"
                                }
                            })}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending Link..." : "Send Reset Link"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-all font-bold group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
