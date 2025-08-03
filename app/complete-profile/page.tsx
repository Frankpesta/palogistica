"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useQuery } from "convex/react";

export default function CompleteProfilePage() {
	const [form, setForm] = useState({
		name: "",
		role: "client",
		companyName: "",
		avatar: "",
	});
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { theme, setTheme } = useTheme();
	const completeProfile = useMutation(api.user.completeUserProfile);
	const debugAuth = useQuery(api.user.debugAuth);
	const router = useRouter();

	const handleComplete = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		if (!form.name.trim()) {
			setError("Full name is required");
			setIsSubmitting(false);
			return;
		}

		try {
			await completeProfile({
				name: form.name,
				role: form.role as "client" | "palogistica",
				companyName: form.companyName,
				avatar: form.avatar,
			});

			toast.success("Profile completed successfully!");
			router.push(form.role === "palogistica" ? "/admin" : "/dashboard");
		} catch (err: any) {
			setError(err.message || "Failed to complete profile");
			toast.error(err.message || "Failed to complete profile");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Branding */}
				<div className="text-center">
					<div className="flex items-center justify-center mb-4">
						<Package className="h-12 w-12 text-blue-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Palogistica
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Delivery Management System
					</p>
				</div>

				{/* Theme toggle */}
				<div className="flex justify-center">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
						<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</Button>
				</div>

				{/* Complete Profile Card */}
				<Card>
					<CardHeader>
						<CardTitle>Complete Your Profile</CardTitle>
						<CardDescription>
							Provide the remaining details to set up your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleComplete} className="space-y-4" noValidate>
							{/* Full Name */}
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									placeholder="Enter your full name"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									required
								/>
							</div>

							{/* Role */}
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<select
									id="role"
									value={form.role}
									onChange={(e) => setForm({ ...form, role: e.target.value })}
									className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
									<option value="client">Client</option>
									<option value="palogistica">Palogistica Staff</option>
								</select>
							</div>

							{/* Company Name */}
							<div className="space-y-2">
								<Label htmlFor="companyName">Company Name</Label>
								<Input
									id="companyName"
									placeholder="Enter your company name"
									value={form.companyName}
									onChange={(e) =>
										setForm({ ...form, companyName: e.target.value })
									}
								/>
							</div>

							{/* Avatar URL */}
							<div className="space-y-2">
								<Label htmlFor="avatar">Avatar URL</Label>
								<Input
									id="avatar"
									placeholder="Enter avatar image URL"
									value={form.avatar}
									onChange={(e) => setForm({ ...form, avatar: e.target.value })}
								/>
							</div>

							{/* Error */}
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Complete Profile"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
