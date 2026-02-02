"use client";

import { useState, useEffect } from "react";
import { getImagePath } from "@/utils/imagePath";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, Box, Mail } from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("content");

    useEffect(() => {
        const token = localStorage.getItem("cms_token");
        if (!token) {
            router.push("/admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("cms_token");
        router.push("/admin");
    };

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-black font-space">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white">CMS Admin</h2>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <SidebarItem
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Dashboard"
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <SidebarItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Home Content"
                        active={activeTab === "content"}
                        onClick={() => setActiveTab("content")}
                    />
                    <SidebarItem
                        icon={<ImageIcon className="w-5 h-5" />}
                        label="Portfolio"
                        active={activeTab === "portfolio"}
                        onClick={() => setActiveTab("portfolio")}
                    />
                    <SidebarItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Services"
                        active={activeTab === "services"}
                        onClick={() => setActiveTab("services")}
                    />
                    <SidebarItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Testimonials"
                        active={activeTab === "testimonials"}
                        onClick={() => setActiveTab("testimonials")}
                    />
                    <SidebarItem
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Team"
                        active={activeTab === "team"}
                        onClick={() => setActiveTab("team")}
                    />
                    <SidebarItem
                        icon={<Box className="w-5 h-5" />}
                        label="Products"
                        active={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                    />
                    <SidebarItem
                        icon={<Mail className="w-5 h-5" />}
                        label="Contact Info"
                        active={activeTab === "contact"}
                        onClick={() => setActiveTab("contact")}
                    />
                    <SidebarItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                    />
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-syne font-bold text-gray-900 dark:text-white">
                        {activeTab === 'content' && 'Edit Home Content'}
                        {activeTab === 'dashboard' && 'Dashboard Overview'}
                        {activeTab === 'portfolio' && 'Manage Portfolio'}
                        {activeTab === 'settings' && 'System Settings'}
                        {activeTab === 'products' && 'Manage Products / SaaS'}
                        {activeTab === 'contact' && 'Contact Information'}
                    </h1>
                </header>

                {activeTab === 'content' && <ContentEditor />}

                {activeTab === 'dashboard' && <p className="text-gray-500">Welcome to your CMS. Select an option from the sidebar.</p>}

                {activeTab === 'portfolio' && (
                    <ListEditor
                        title="Manage Portfolio"
                        storageKey="portfolio_items"
                        itemTemplate={{ title: "Project Name", category: "Web Design", image: "https://..." }}
                    />
                )}

                {activeTab === 'services' && (
                    <ListEditor
                        title="Manage Services"
                        storageKey="services"
                        itemTemplate={{ title: "Service Name", desc: "Description here..." }}
                    />
                )}

                {activeTab === 'testimonials' && (
                    <ListEditor
                        title="Manage Testimonials"
                        storageKey="testimonials"
                        itemTemplate={{ quote: "Amazing work!", author: "John Doe", role: "CEO", image: "https://..." }}
                    />
                )}

                {activeTab === 'team' && (
                    <ListEditor
                        title="Manage Team"
                        storageKey="team_members"
                        itemTemplate={{ name: "Jane Doe", role: "Designer", strength: "Creativity", category: "Design", image: "https://..." }}
                    />
                )}

                {activeTab === 'products' && (
                    <ListEditor
                        title="Manage Products / SaaS"
                        storageKey="products"
                        itemTemplate={{ name: "Product Name", description: "Short description", link: "#", image: "https://..." }}
                    />
                )}

                {activeTab === 'contact' && <ContactEditor />}

                {activeTab === 'settings' && <SettingsEditor />}
            </main>
        </div>
    );
}


interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}



function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active
                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function ContentEditor() {
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const res = await fetch("/api/content.php");
            const data = await res.json();
            if (data.hero_title) setHeroTitle(data.hero_title);
            if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        } catch (err) {
            console.error("Failed to load content", err);
        }
    };

    const saveContent = async () => {
        setLoading(true);
        setMessage("");
        try {
            // Save Title
            await fetch("/api/content.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "hero_title", value: heroTitle }),
            });

            // Save Subtitle
            await fetch("/api/content.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "hero_subtitle", value: heroSubtitle }),
            });

            setMessage("Content saved successfully!");
        } catch {
            setMessage("Failed to save content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Hero Section Text</h3>
            {message && <p className="mb-4 text-green-500 text-sm font-bold">{message}</p>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Main Heading</label>
                    <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        placeholder="Digital Alchemy"
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Subheading</label>
                    <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        placeholder="Where Strategy Meets Serendipity"
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20 h-24"
                    />
                </div>
                <button
                    onClick={saveContent}
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    )
}

function ListEditor({ title, storageKey, itemTemplate }: { title: string, storageKey: string, itemTemplate: any }) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<number | null>(null); // Index of item currently uploading

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const res = await fetch("/api/content.php");
            const data = await res.json();
            if (data[storageKey]) {
                setItems(JSON.parse(data[storageKey]));
            } else {
                setItems([]);
            }
        } catch (err) {
            console.error("Failed to load list", err);
        }
    };

    const saveItems = async (newItems: any[]) => {
        setLoading(true);
        try {
            const res = await fetch("/api/content.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: storageKey, value: JSON.stringify(newItems) }),
            });
            const data = await res.json();
            if (!data.success) {
                alert("Database Save Failed: " + (data.message || "Unknown error"));
                console.error("Save failed response:", data);
            }
        } catch (err) {
            console.error("Failed to save list", err);
            alert("Network Error during Save: " + err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        const newItems = [...items, { ...itemTemplate, id: Date.now() }];
        setItems(newItems);
        saveItems(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        saveItems(newItems);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleFileUpload = async (index: number, field: string, file: File) => {
        setUploading(index);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload.php", {
                method: "POST",
                body: formData,
            });
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    updateItem(index, field, data.url);
                    saveItems([...items]);
                } else {
                    alert("Upload failed: " + data.error);
                }
            } catch (e) {
                console.error("Server response:", text);
                alert("Server Error (Check Permissions): " + text.substring(0, 100));
            }
        } catch (err: any) {
            alert("Network Error: " + err.message);
            console.error(err);
        } finally {
            setUploading(null);
        }
    };

    const handleBlur = () => {
        saveItems(items);
    };

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={addItem} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm hover:opacity-80">
                    + Add Item
                </button>
            </div>

            <div className="space-y-4">
                {items.length === 0 && <p className="text-gray-500 italic">No items yet. Click Add Item to start.</p>}

                {items.map((item, index) => (
                    <div key={item.id || index} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative group">
                        <button
                            onClick={() => removeItem(index)}
                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs bg-white dark:bg-black px-2 py-1 rounded z-10"
                        >
                            DELETE
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(itemTemplate).map((key) => {
                                if (key === 'id') return null;

                                const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('icon');

                                return (
                                    <div key={key}>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{key}</label>

                                        {isImage ? (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item[key] || ""}
                                                        onChange={(e) => updateItem(index, key, e.target.value)}
                                                        onBlur={handleBlur}
                                                        className="flex-grow p-2 text-sm rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-white/20"
                                                        placeholder="Image URL or Upload ->"
                                                    />
                                                    <label className="cursor-pointer px-3 py-2 bg-primary text-black rounded-lg text-xs font-bold hover:brightness-110 flex items-center justify-center">
                                                        {uploading === index ? "..." : "Upload"}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    handleFileUpload(index, key, e.target.files[0]);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                {item[key] && (
                                                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={getImagePath(item[key])} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={item[key] || ""}
                                                onChange={(e) => updateItem(index, key, e.target.value)}
                                                onBlur={handleBlur}
                                                className="w-full p-2 text-sm rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-white/20"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <p className="text-xs text-center mt-4 text-gray-500 animate-pulse">Saving changes...</p>}
        </div>
    );
}

function ContactEditor() {
    const [contact, setContact] = useState({
        email: "",
        phone: "",
        address: "",
        instagram: "",
        linkedin: "",
        twitter: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const res = await fetch("/api/content.php");
            const data = await res.json();
            if (data.contact_info) {
                try {
                    const parsed = JSON.parse(data.contact_info);
                    setContact(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Parse error for contact info", e);
                }
            }
        } catch (err) {
            console.error("Failed to load content", err);
        }
    };

    const saveContent = async () => {
        setLoading(true);
        setMessage("");
        try {
            await fetch("/api/content.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "contact_info", value: JSON.stringify(contact) }),
            });
            setMessage("Contact info saved!");
        } catch {
            setMessage("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setContact(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            {message && <p className="mb-4 text-green-500 text-sm font-bold">{message}</p>}

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="text"
                            value={contact.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Phone</label>
                        <input
                            type="text"
                            value={contact.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Address</label>
                    <input
                        type="text"
                        value={contact.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Instagram URL</label>
                        <input
                            type="text"
                            value={contact.instagram}
                            onChange={(e) => handleChange("instagram", e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">LinkedIn URL</label>
                        <input
                            type="text"
                            value={contact.linkedin}
                            onChange={(e) => handleChange("linkedin", e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Twitter URL</label>
                        <input
                            type="text"
                            value={contact.twitter}
                            onChange={(e) => handleChange("twitter", e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                        />
                    </div>
                </div>
                <button
                    onClick={saveContent}
                    disabled={loading}
                    className="mt-4 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

function SettingsEditor() {
    const [username, setUsername] = useState("admin");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/change_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, old_password: oldPassword, new_password: newPassword }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setMessage("Password updated successfully!");
                setOldPassword("");
                setNewPassword("");
            } else {
                setMessage("Error: " + data.message);
            }
        } catch (err) {
            setMessage("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 max-w-xl">
            <h3 className="text-xl font-bold mb-6">Security Settings</h3>

            {message && (
                <div className={`p-4 rounded-lg mb-6 text-sm font-bold ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                    />
                    <p className="text-xs text-gray-400 mt-1">Must match your current login username.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Current Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/20"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleChangePassword}
                        disabled={loading || !oldPassword || !newPassword}
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-80 disabled:opacity-50 transition-opacity"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}
