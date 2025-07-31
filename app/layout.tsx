import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { RealTimeProvider } from "@/components/real-time-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Palogistica - Delivery Management System",
	description: "Professional delivery management platform for businesses",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange>
					<AuthProvider>
						<RealTimeProvider>
							{children}
							<Toaster />
						</RealTimeProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
