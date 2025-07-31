"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
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
import { useGSAP } from "@/hooks/use-gsap";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { login, user } = useAuth();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const containerRef = useGSAP();

	useEffect(() => {
		if (user) {
			if (user.role === "client") {
				router.push("/dashboard");
			} else {
				router.push("/admin");
			}
		}
	}, [user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		const success = await login(email, password);

		if (!success) {
			setError(
				"Invalid credentials. Try: client@companya.com or admin@palogistica.com with password: password"
			);
		}

		setIsSubmitting(false);
	};

	return (
		<div
			ref={containerRef}
			className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Header */}
				<div className="text-center fade-in">
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

				{/* Theme Toggle */}
				<div className="flex justify-center fade-in">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
						<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</Button>
				</div>

				{/* Login Form */}
				<Card className="slide-up">
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access the system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
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
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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
										Signing in...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>

						{/* Demo Credentials */}
						<div className="mt-6 p-4 bg-muted rounded-lg">
							<p className="text-sm font-medium mb-2">Demo Credentials:</p>
							<div className="text-xs space-y-1">
								<p>
									<strong>Client User:</strong> client@companya.com
								</p>
								<p>
									<strong>Palogistica Staff:</strong> admin@palogistica.com
								</p>
								<p>
									<strong>Password:</strong> password
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
