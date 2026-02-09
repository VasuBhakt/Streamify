import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import userService from "../services/user";
import { login, logout } from "../features/authSlice";
import Container from "../components/container/Container";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { Loader2, Camera, Lock, User, Mail, Image as ImageIcon, Info, Eye, EyeOff } from "lucide-react";
import tw from "../utils/tailwindUtil";
import authService from "../services/auth";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const user = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState(user?.description || "");
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);
    const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

    const avatarInputRef = useRef();
    const coverInputRef = useRef();

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await userService.updateUserAccountDetails({ fullName, email, description });
            if (response?.data) {
                dispatch(login({ ...user, fullName, email, description }));
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setAvatarLoading(true);
            const response = await userService.updateUserAvatar(file);
            if (response?.data) {
                dispatch(login(response.data));
                alert("Avatar updated!");
            }
        } catch (error) {
            alert("Avatar upload failed.");
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setCoverLoading(true);
            const response = await userService.updateUserCoverImage(file);
            if (response?.data) {
                dispatch(login(response.data));
                alert("Cover image updated!");
            }
        } catch (error) {
            alert("Cover image upload failed.");
        } finally {
            setCoverLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            let confirm = window.confirm("Are you sure you want to delete your account?");
            if (!confirm) return;
            setDeleteAccountLoading(true);
            const response = await authService.deleteAccount();
            if (response?.success) {
                dispatch(logout());
                navigate("/");
                alert("Account deleted successfully!");
            }
        } catch (error) {
            alert("Failed to delete account.");
        } finally {
            setDeleteAccountLoading(false);
        }
    };

    return (
        <div className="flex-1 pb-20 bg-background-page">
            <div className="bg-surface/30 border-b border-border py-12 mb-10">
                <Container>
                    <h1 className="text-4xl font-black text-text-main px-4 tracking-tight">Settings <span className="text-primary">@{user?.username}</span></h1>
                    <p className="text-text-secondary px-4 mt-2 font-medium">Manage your account and channel identity</p>
                </Container>
            </div>

            <Container className="px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Branding */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-surface/10 rounded-3xl p-8 border border-border/40">
                            <h2 className="text-xl font-bold text-text-main mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Branding
                            </h2>

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-2xl relative">
                                        <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        {avatarLoading && (
                                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 size={24} className="text-primary animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => avatarInputRef.current.click()}
                                        className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-secondary-hover transition-all cursor-pointer active:scale-90"
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-text-main">Profile Picture</h3>
                                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Recommended: 800x800px</p>
                                </div>
                            </div>

                            {/* Cover Image Section */}
                            <div className="mt-12">
                                <div className="relative rounded-2xl overflow-hidden border border-border bg-surface shadow-lg h-32 w-full group">
                                    {user?.coverImage ? (
                                        <img src={user.coverImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-surface to-surface-hover flex items-center justify-center">
                                            <ImageIcon size={32} className="text-text-muted/30" />
                                        </div>
                                    )}
                                    {coverLoading && (
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 size={24} className="text-primary animate-spin" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => coverInputRef.current.click()}
                                        className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md text-text-main rounded-xl border border-border/50 hover:bg-surface transition-all cursor-pointer active:scale-95"
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold text-text-main text-sm">Banner Image</h3>
                                    <p className="text-xs text-text-muted mt-0.5">This will appear at the top of your channel.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Account Details */}
                        <section className="bg-surface/10 rounded-3xl p-8 border border-border/40">
                            <h2 className="text-xl font-bold text-text-main mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-success rounded-full" />
                                Personal Info
                            </h2>
                            <form onSubmit={handleUpdateDetails} className="space-y-6">
                                <Input label="Full Name (Channel)" icon={User} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your display name" />
                                <Input label="Email Address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email linked to this account" />
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-main flex items-center gap-2">
                                        <Info size={18} className="text-primary" />
                                        Channel Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell your viewers what your channel is about..."
                                        className="w-full bg-surface/5 border border-border rounded-2xl p-4 text-text-main min-h-[140px] outline-none focus:border-primary transition-all text-sm font-medium resize-none shadow-inner"
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button variant="primary" type="submit" className="w-full md:w-auto px-10 rounded-2xl font-bold py-3 shadow-lg shadow-primary/20" disabled={loading}>
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </section>
                        <section className="bg-surface/10 rounded-3xl p-8 border border-border/40">
                            <h2 className="text-xl font-bold text-text-main mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-error rounded-full" />
                                Security
                            </h2>
                            <div className="pt-4">
                                <Button variant="danger" onClick={handleDeleteAccount} className="w-full md:w-auto px-10 rounded-2xl font-bold py-3" disabled={deleteAccountLoading}>
                                    {deleteAccountLoading ? <Loader2 size={20} className="animate-spin" /> : "Delete Account"}
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Settings;
