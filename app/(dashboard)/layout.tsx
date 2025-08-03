"use client";

import type React from "react";

import { useAuth } from "@/components/auth-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading, isProfileIncomplete } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log("DashboardLayout - Auth state:", {
			isLoading,
			hasUser: !!user,
			isProfileIncomplete,
			userName: user?.name,
			userEmail: user?.email,
		});

		if (!isLoading) {
			if (!user) {
				console.log("No user found, redirecting to login");
				router.push("/login");
			} else if (isProfileIncomplete) {
				console.log("Profile incomplete, redirecting to complete-profile");
				router.push("/complete-profile");
			}
		}
	}, [user, isLoading, isProfileIncomplete, router]);

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

	if (!user) {
		return null; // Will redirect to login
	}

	if (isProfileIncomplete) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
					<p className="text-muted-foreground">
						Redirecting to complete profile...
					</p>
				</div>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
