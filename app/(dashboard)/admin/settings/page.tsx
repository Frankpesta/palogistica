"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Shield, Database, Truck } from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import { toast } from "sonner";

export default function AdminSettingsPage() {
	const containerRef = useGSAP();

	// General Settings
	const [generalSettings, setGeneralSettings] = useState({
		companyName: "Palogistica",
		companyEmail: "admin@palogistica.com",
		companyPhone: "+1-555-0100",
		companyAddress: "123 Logistics Ave, New York, NY 10001",
		timezone: "America/New_York",
		currency: "USD",
		language: "en",
	});

	// Notification Settings
	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		smsNotifications: false,
		pushNotifications: true,
		orderUpdates: true,
		incidentAlerts: true,
		systemMaintenance: true,
		weeklyReports: true,
	});

	// Delivery Settings
	const [deliverySettings, setDeliverySettings] = useState({
		defaultDeliveryTime: "24",
		maxDeliveryRadius: "50",
		emergencyDeliveryFee: "25.00",
		standardDeliveryFee: "15.00",
		autoAssignDrivers: true,
		requireSignature: true,
		allowWeekendDelivery: true,
	});

	// Security Settings
	const [securitySettings, setSecuritySettings] = useState({
		twoFactorAuth: false,
		sessionTimeout: "30",
		passwordExpiry: "90",
		loginAttempts: "5",
		ipWhitelist: "",
	});

	const handleSaveSettings = (section: string) => {
		toast(`${section} settings have been updated successfully.`);
	};

	const breadcrumbs = [
		{ label: "Admin Dashboard", href: "/admin" },
		{ label: "Settings" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
					<p className="text-muted-foreground">
						Configure system-wide settings and preferences
					</p>
				</div>

				{/* General Settings */}
				<Card className="slide-up">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="h-5 w-5" />
							General Settings
						</CardTitle>
						<CardDescription>
							Basic company and system configuration
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="companyName">Company Name</Label>
								<Input
									id="companyName"
									value={generalSettings.companyName}
									onChange={(e) =>
										setGeneralSettings((prev) => ({
											...prev,
											companyName: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="companyEmail">Company Email</Label>
								<Input
									id="companyEmail"
									type="email"
									value={generalSettings.companyEmail}
									onChange={(e) =>
										setGeneralSettings((prev) => ({
											...prev,
											companyEmail: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="companyPhone">Company Phone</Label>
								<Input
									id="companyPhone"
									value={generalSettings.companyPhone}
									onChange={(e) =>
										setGeneralSettings((prev) => ({
											...prev,
											companyPhone: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Select
									value={generalSettings.timezone}
									onValueChange={(value) =>
										setGeneralSettings((prev) => ({ ...prev, timezone: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="America/New_York">
											Eastern Time
										</SelectItem>
										<SelectItem value="America/Chicago">
											Central Time
										</SelectItem>
										<SelectItem value="America/Denver">
											Mountain Time
										</SelectItem>
										<SelectItem value="America/Los_Angeles">
											Pacific Time
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="currency">Currency</Label>
								<Select
									value={generalSettings.currency}
									onValueChange={(value) =>
										setGeneralSettings((prev) => ({ ...prev, currency: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">USD - US Dollar</SelectItem>
										<SelectItem value="EUR">EUR - Euro</SelectItem>
										<SelectItem value="GBP">GBP - British Pound</SelectItem>
										<SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select
									value={generalSettings.language}
									onValueChange={(value) =>
										setGeneralSettings((prev) => ({ ...prev, language: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="es">Spanish</SelectItem>
										<SelectItem value="fr">French</SelectItem>
										<SelectItem value="de">German</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="companyAddress">Company Address</Label>
							<Textarea
								id="companyAddress"
								value={generalSettings.companyAddress}
								onChange={(e) =>
									setGeneralSettings((prev) => ({
										...prev,
										companyAddress: e.target.value,
									}))
								}
								rows={3}
							/>
						</div>
						<Button onClick={() => handleSaveSettings("General")}>
							Save General Settings
						</Button>
					</CardContent>
				</Card>

				{/* Notification Settings */}
				<Card className="slide-up">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							Notification Settings
						</CardTitle>
						<CardDescription>
							Configure notification preferences and alerts
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Email Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive notifications via email
									</p>
								</div>
								<Switch
									checked={notificationSettings.emailNotifications}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											emailNotifications: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>SMS Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive notifications via SMS
									</p>
								</div>
								<Switch
									checked={notificationSettings.smsNotifications}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											smsNotifications: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Push Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive browser push notifications
									</p>
								</div>
								<Switch
									checked={notificationSettings.pushNotifications}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											pushNotifications: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Order Updates</Label>
									<p className="text-sm text-muted-foreground">
										Notifications for order status changes
									</p>
								</div>
								<Switch
									checked={notificationSettings.orderUpdates}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											orderUpdates: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Incident Alerts</Label>
									<p className="text-sm text-muted-foreground">
										Immediate alerts for delivery incidents
									</p>
								</div>
								<Switch
									checked={notificationSettings.incidentAlerts}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											incidentAlerts: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Weekly Reports</Label>
									<p className="text-sm text-muted-foreground">
										Weekly performance and analytics reports
									</p>
								</div>
								<Switch
									checked={notificationSettings.weeklyReports}
									onCheckedChange={(checked) =>
										setNotificationSettings((prev) => ({
											...prev,
											weeklyReports: checked,
										}))
									}
								/>
							</div>
						</div>
						<Button onClick={() => handleSaveSettings("Notification")}>
							Save Notification Settings
						</Button>
					</CardContent>
				</Card>

				{/* Delivery Settings */}
				<Card className="slide-up">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Truck className="h-5 w-5" />
							Delivery Settings
						</CardTitle>
						<CardDescription>
							Configure delivery parameters and pricing
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="defaultDeliveryTime">
									Default Delivery Time (hours)
								</Label>
								<Input
									id="defaultDeliveryTime"
									type="number"
									value={deliverySettings.defaultDeliveryTime}
									onChange={(e) =>
										setDeliverySettings((prev) => ({
											...prev,
											defaultDeliveryTime: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxDeliveryRadius">
									Max Delivery Radius (km)
								</Label>
								<Input
									id="maxDeliveryRadius"
									type="number"
									value={deliverySettings.maxDeliveryRadius}
									onChange={(e) =>
										setDeliverySettings((prev) => ({
											...prev,
											maxDeliveryRadius: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="standardDeliveryFee">
									Standard Delivery Fee ($)
								</Label>
								<Input
									id="standardDeliveryFee"
									type="number"
									step="0.01"
									value={deliverySettings.standardDeliveryFee}
									onChange={(e) =>
										setDeliverySettings((prev) => ({
											...prev,
											standardDeliveryFee: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="emergencyDeliveryFee">
									Emergency Delivery Fee ($)
								</Label>
								<Input
									id="emergencyDeliveryFee"
									type="number"
									step="0.01"
									value={deliverySettings.emergencyDeliveryFee}
									onChange={(e) =>
										setDeliverySettings((prev) => ({
											...prev,
											emergencyDeliveryFee: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Auto-assign Drivers</Label>
									<p className="text-sm text-muted-foreground">
										Automatically assign available drivers to orders
									</p>
								</div>
								<Switch
									checked={deliverySettings.autoAssignDrivers}
									onCheckedChange={(checked) =>
										setDeliverySettings((prev) => ({
											...prev,
											autoAssignDrivers: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Require Signature</Label>
									<p className="text-sm text-muted-foreground">
										Require customer signature for deliveries
									</p>
								</div>
								<Switch
									checked={deliverySettings.requireSignature}
									onCheckedChange={(checked) =>
										setDeliverySettings((prev) => ({
											...prev,
											requireSignature: checked,
										}))
									}
								/>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Weekend Deliveries</Label>
									<p className="text-sm text-muted-foreground">
										Allow deliveries on weekends
									</p>
								</div>
								<Switch
									checked={deliverySettings.allowWeekendDelivery}
									onCheckedChange={(checked) =>
										setDeliverySettings((prev) => ({
											...prev,
											allowWeekendDelivery: checked,
										}))
									}
								/>
							</div>
						</div>
						<Button onClick={() => handleSaveSettings("Delivery")}>
							Save Delivery Settings
						</Button>
					</CardContent>
				</Card>

				{/* Security Settings */}
				<Card className="slide-up">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Security Settings
						</CardTitle>
						<CardDescription>
							Configure security and access control settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="sessionTimeout">
									Session Timeout (minutes)
								</Label>
								<Input
									id="sessionTimeout"
									type="number"
									value={securitySettings.sessionTimeout}
									onChange={(e) =>
										setSecuritySettings((prev) => ({
											...prev,
											sessionTimeout: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
								<Input
									id="passwordExpiry"
									type="number"
									value={securitySettings.passwordExpiry}
									onChange={(e) =>
										setSecuritySettings((prev) => ({
											...prev,
											passwordExpiry: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="loginAttempts">Max Login Attempts</Label>
								<Input
									id="loginAttempts"
									type="number"
									value={securitySettings.loginAttempts}
									onChange={(e) =>
										setSecuritySettings((prev) => ({
											...prev,
											loginAttempts: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="ipWhitelist">
								IP Whitelist (comma-separated)
							</Label>
							<Textarea
								id="ipWhitelist"
								placeholder="192.168.1.1, 10.0.0.1"
								value={securitySettings.ipWhitelist}
								onChange={(e) =>
									setSecuritySettings((prev) => ({
										...prev,
										ipWhitelist: e.target.value,
									}))
								}
								rows={3}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label>Two-Factor Authentication</Label>
								<p className="text-sm text-muted-foreground">
									Require 2FA for all admin accounts
								</p>
							</div>
							<Switch
								checked={securitySettings.twoFactorAuth}
								onCheckedChange={(checked) =>
									setSecuritySettings((prev) => ({
										...prev,
										twoFactorAuth: checked,
									}))
								}
							/>
						</div>
						<Button onClick={() => handleSaveSettings("Security")}>
							Save Security Settings
						</Button>
					</CardContent>
				</Card>

				{/* System Status */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Database className="h-5 w-5" />
							System Status
						</CardTitle>
						<CardDescription>Current system health and status</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center p-4 border rounded-lg">
								<div className="flex items-center justify-center gap-2 mb-2">
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									<span className="font-semibold">Database</span>
								</div>
								<Badge className="bg-green-100 text-green-800">Online</Badge>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<div className="flex items-center justify-center gap-2 mb-2">
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									<span className="font-semibold">API Services</span>
								</div>
								<Badge className="bg-green-100 text-green-800">
									Operational
								</Badge>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<div className="flex items-center justify-center gap-2 mb-2">
									<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
									<span className="font-semibold">Notifications</span>
								</div>
								<Badge className="bg-yellow-100 text-yellow-800">
									Degraded
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
