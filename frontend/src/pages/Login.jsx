import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../services/auth.js";
import { login as authLogin } from "../features/authSlice.js";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import { Lock, Mail } from "lucide-react";

function Login() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const login = async (data) => {
        setError("");
        setIsLoading(true);
        try {
            const response = await authService.loginUser(data);
            if (response?.data) {
                dispatch(authLogin(response?.data?.loggedInUser));
                navigate("/home");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
            <div className="w-1/2 space-y-8 bg-surface/50 p-8 rounded-3xl border border-border/50 backdrop-blur-xl shadow-2xl">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-text-main tracking-tight">
                        Sign in to Streamify
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5">
                    <div className="space-y-4">
                        <Input
                            label="Email / Username"
                            placeholder="Enter your email or username"
                            icon={Mail}
                            {...register("username", {
                                required: "Email or username is required"
                            })}
                            error={errors.username?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon={Lock}
                            {...register("password", {
                                required: "Password is required"
                            })}
                            error={errors.password?.message}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border/50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
