"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "client" | "palogistica";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	companyId?: string;
	companyName?: string;
	avatar?: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
	{
		id: "1",
		email: "client@companya.com",
		name: "John Smith",
		role: "client",
		companyId: "client_001",
		companyName: "Company A",
		avatar: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "2",
		email: "admin@palogistica.com",
		name: "Sarah Johnson",
		role: "palogistica",
		avatar: "/placeholder.svg?height=40&width=40",
	},
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Check for stored auth on mount
		const storedUser = localStorage.getItem("palogistica_user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const foundUser = mockUsers.find((u) => u.email === email);

		if (foundUser && password === "password") {
			setUser(foundUser);
			localStorage.setItem("palogistica_user", JSON.stringify(foundUser));

			// Role-based redirect
			if (foundUser.role === "client") {
				router.push("/dashboard");
			} else {
				router.push("/admin");
			}

			setIsLoading(false);
			return true;
		}

		setIsLoading(false);
		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("palogistica_user");
		router.push("/login");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
