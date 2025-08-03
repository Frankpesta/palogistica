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
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { theme, setTheme } = useTheme();
	const { signIn } = useAuthActions();
	const router = useRouter();

	const validatePassword = (password: string) => {
		const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		return re.test(password);
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!validatePassword(password)) {
			setError(
				"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
			);
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsSubmitting(true);

		try {
			// Step 1: Sign up with Convex Auth
			await signIn("password", { email, password, flow: "signUp" });

			// Step 2: Redirect to complete-profile
			toast.success("Account created! Please complete your profile.");
			router.push("/complete-profile");
		} catch (err: any) {
			setError(err.message || "Registration failed");
			toast.error(err.message || "Registration failed");
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

				{/* Register card */}
				<Card>
					<CardHeader>
						<CardTitle>Create Account</CardTitle>
						<CardDescription>Fill in your details to register</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleRegister} className="space-y-4" noValidate>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Register"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
