"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";

export default function HomePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				// Redirect based on role
				if (user.role === "client") {
					router.push("/dashboard");
				} else {
					router.push("/admin");
				}
			} else {
				router.push("/login");
			}
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return null;
}
