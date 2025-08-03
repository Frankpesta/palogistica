"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export type UserRole = "client" | "palogistica";

export interface User {
	authSubject: string;
	email: string;
	name: string;
	role: UserRole;
	companyId?: string;
	companyName?: string;
	avatar?: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isProfileIncomplete: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
	const router = useRouter();
	const { signIn, signOut } = useAuthActions();

	const profile = useQuery(api.user.getCurrentUserProfile);

	useEffect(() => {
		console.log("Profile from query:", profile);

		if (profile !== undefined) {
			// Profile query has completed (either with data or null)
			if (profile) {
				// Profile exists - check if it's complete
				const isIncomplete = !profile.name || profile.name.trim() === "";
				setIsProfileIncomplete(isIncomplete);
				setUser(profile);

				console.log("Profile loaded:", {
					hasProfile: true,
					isIncomplete,
					name: profile.name,
					authSubject: profile.authSubject,
				});
			} else {
				// No profile found at all
				setUser(null);
				setIsProfileIncomplete(false);
				console.log("No profile found");
			}
			setIsLoading(false);
		} else {
			// Profile query is still loading
			console.log("Profile query still loading...");
		}
	}, [profile]);

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);
		try {
			await signIn("password", { email, password, flow: "signIn" });
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		await signOut();
		setUser(null);
		setIsProfileIncomplete(false);
		router.push("/login");
	};

	return (
		<AuthContext.Provider
			value={{ user, isLoading, isProfileIncomplete, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
