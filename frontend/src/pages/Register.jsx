import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.js";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import { User, Mail, Lock, Camera, Image as ImageIcon, X, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { MAX_IMAGE_SIZE } from "../constants.js";

function Register() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const avatarFile = watch("avatar");
    const coverImageFile = watch("coverImage");

    useEffect(() => {
        if (avatarFile && avatarFile.length > 0) {
            const file = avatarFile[0];
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [avatarFile]);

    useEffect(() => {
        if (coverImageFile && coverImageFile.length > 0) {
            const file = coverImageFile[0];
            const url = URL.createObjectURL(file);
            setCoverPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [coverImageFile]);

    const createAccount = async (data) => {
        setError("");
        setIsLoading(true);
        try {
            const userData = await authService.registerUser({
                ...data,
                avatar: data.avatar[0],
                coverImage: data.coverImage[0]
            });
            if (userData) {
                setRegistrationSuccess(true);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Something went wrong during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full mx-auto">
            {/* Previews Section */}
            {!registrationSuccess ? (
                <div className="w-4/5 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-surface/50 p-8 rounded-3xl border border-border/50 backdrop-blur-xl shadow-2xl">
                    <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <Camera size={20} className="text-primary" />
                                Profile Preview
                            </h3>

                            {/* Cover Preview */}
                            <div className="relative w-full aspect-video rounded-2xl bg-surface/30 border-2 border-dashed border-border/50 overflow-hidden flex items-center justify-center group">
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                                        <p className="text-xs text-text-muted">No cover image selected</p>
                                    </div>
                                )}

                                {/* Avatar Overlay */}
                                <div className="absolute bottom-4 left-4 w-20 h-20 rounded-2xl border-4 border-surface overflow-hidden bg-surface shadow-xl shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                            <User size={32} className="text-primary/40" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <p className="text-xs text-text-secondary leading-relaxed italic">
                                    This is how your channel will appear to others. A great cover and avatar help in building your brand identity on Streamify.
                                </p>
                                <p className="text-xs text-text-secondary leading-relaxed italic">
                                    Maximum size allowed for images is 10MB.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <div>
                            <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
                                Create account
                            </h2>
                            <p className="mt-2 text-sm text-text-secondary">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                    Sign in instead
                                </Link>
                            </p>
                            <p className="text-xs text-text-secondary">
                                Careful with your username, you cannot change it later!
                            </p>
                        </div>

                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(createAccount)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    icon={User}
                                    {...register("fullName", { required: "Full name is required" })}
                                    error={errors.fullName?.message}
                                />

                                <Input
                                    label="Username"
                                    placeholder="johndoe123"
                                    icon={User}
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: { value: 3, message: "Username must be at least 3 characters" }
                                    })}
                                    error={errors.username?.message}
                                />
                            </div>

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                icon={Mail}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address"
                                    }
                                })}
                                error={errors.email?.message}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                icon={Lock}
                                rightElement={
                                    <button
                                        type="button"
                                        className="w-5 h-5 cursor-pointer mr-2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </button>
                                }
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                error={errors.password?.message}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Avatar"
                                    type="file"
                                    accept="image/*"
                                    icon={Camera}
                                    {...register("avatar", {
                                        required: "Avatar is required",
                                        validate: {
                                            lessThan10MB: files => files[0]?.size < MAX_IMAGE_SIZE || "Avatar must be less than 10MB"
                                        }
                                    })}
                                    error={errors.avatar?.message}
                                    className="cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />

                                <Input
                                    label="Cover Image"
                                    type="file"
                                    accept="image/*"
                                    icon={ImageIcon}
                                    {...register("coverImage", {
                                        validate: {
                                            lessThan10MB: files => !files[0] || files[0]?.size < MAX_IMAGE_SIZE || "Cover image must be less than 10MB"
                                        }
                                    })}
                                    error={errors.coverImage?.message}
                                    className="cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    isLoading={isLoading}
                                >
                                    Register Now
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-8 py-12 order-1 lg:order-2">
                    <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center text-success animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black text-text-main tracking-tight">Verify Your Email</h2>
                        <p className="text-text-secondary font-medium max-w-sm mx-auto leading-relaxed">
                            We've sent a verification link to your email. Please click it within <span className="text-primary font-bold">3 hours</span> to activate your account.
                        </p>
                    </div>
                    <div className="w-full max-w-sm space-y-4">
                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-3">
                            <Mail className="text-primary mt-1 shrink-0" size={18} />
                            <p className="text-xs text-text-secondary">
                                Check your spam folder if you don't see the email in your inbox.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate("/login")}
                            variant="primary"
                            className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                        >
                            Continue to Login
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;
