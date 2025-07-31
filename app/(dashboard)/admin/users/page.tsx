"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Search,
	Users,
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Building,
} from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import { toast } from "sonner";
import type { User } from "@/components/auth-provider";

interface Company {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	createdAt: Date;
	status: "active" | "inactive";
}

interface ExtendedUser extends User {
	createdAt: Date;
	lastLogin: Date;
	status: "active" | "inactive";
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<ExtendedUser[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
	const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		role: "client" as "client" | "palogistica",
		companyId: "",
	});
	const [newCompany, setNewCompany] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const containerRef = useGSAP();

	useEffect(() => {
		// Mock users data
		const mockUsers: ExtendedUser[] = [
			{
				id: "1",
				email: "client@companya.com",
				name: "John Smith",
				role: "client",
				companyId: "client_001",
				companyName: "Company A",
				avatar: "/placeholder.svg?height=40&width=40",
				createdAt: new Date("2024-01-10"),
				lastLogin: new Date("2024-01-15T09:30:00"),
				status: "active",
			},
			{
				id: "2",
				email: "admin@palogistica.com",
				name: "Sarah Johnson",
				role: "palogistica",
				avatar: "/placeholder.svg?height=40&width=40",
				createdAt: new Date("2024-01-01"),
				lastLogin: new Date("2024-01-15T14:20:00"),
				status: "active",
			},
			{
				id: "3",
				email: "manager@companyb.com",
				name: "Michael Brown",
				role: "client",
				companyId: "client_002",
				companyName: "Company B",
				avatar: "/placeholder.svg?height=40&width=40",
				createdAt: new Date("2024-01-12"),
				lastLogin: new Date("2024-01-14T16:45:00"),
				status: "active",
			},
			{
				id: "4",
				email: "driver@palogistica.com",
				name: "Carlos Martinez",
				role: "palogistica",
				avatar: "/placeholder.svg?height=40&width=40",
				createdAt: new Date("2024-01-05"),
				lastLogin: new Date("2024-01-15T08:15:00"),
				status: "active",
			},
		];

		const mockCompanies: Company[] = [
			{
				id: "client_001",
				name: "Company A",
				email: "contact@companya.com",
				phone: "+1-555-0100",
				address: "123 Business St, New York, NY 10001",
				createdAt: new Date("2024-01-10"),
				status: "active",
			},
			{
				id: "client_002",
				name: "Company B",
				email: "info@companyb.com",
				phone: "+1-555-0200",
				address: "456 Commerce Ave, Los Angeles, CA 90001",
				createdAt: new Date("2024-01-12"),
				status: "active",
			},
		];

		setUsers(mockUsers);
		setCompanies(mockCompanies);
		setFilteredUsers(mockUsers);
	}, []);

	useEffect(() => {
		let filtered = users;

		if (searchTerm) {
			filtered = filtered.filter(
				(user) =>
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (roleFilter !== "all") {
			filtered = filtered.filter((user) => user.role === roleFilter);
		}

		setFilteredUsers(filtered);
	}, [searchTerm, roleFilter, users]);

	const handleAddUser = () => {
		if (!newUser.name || !newUser.email) return;

		const user: ExtendedUser = {
			id: `user_${Date.now()}`,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
			companyId: newUser.role === "client" ? newUser.companyId : undefined,
			companyName:
				newUser.role === "client"
					? companies.find((c) => c.id === newUser.companyId)?.name
					: undefined,
			avatar: "/placeholder.svg?height=40&width=40",
			createdAt: new Date(),
			lastLogin: new Date(),
			status: "active",
		};

		setUsers((prev) => [...prev, user]);
		toast(`${user.name} has been added successfully.`);

		setIsAddUserDialogOpen(false);
		setNewUser({ name: "", email: "", role: "client", companyId: "" });
	};

	const handleAddCompany = () => {
		if (!newCompany.name || !newCompany.email) return;

		const company: Company = {
			id: `client_${Date.now()}`,
			name: newCompany.name,
			email: newCompany.email,
			phone: newCompany.phone,
			address: newCompany.address,
			createdAt: new Date(),
			status: "active",
		};

		setCompanies((prev) => [...prev, company]);
		toast(`${company.name} has been added successfully.`);

		setIsAddCompanyDialogOpen(false);
		setNewCompany({ name: "", email: "", phone: "", address: "" });
	};

	const handleToggleUserStatus = (userId: string) => {
		setUsers((prev) =>
			prev.map((user) =>
				user.id === userId
					? {
							...user,
							status: user.status === "active" ? "inactive" : "active",
					  }
					: user
			)
		);
	};

	const breadcrumbs = [
		{ label: "Admin Dashboard", href: "/admin" },
		{ label: "User Management" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">User Management</h2>
					<p className="text-muted-foreground">Manage users and companies</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Users</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{users.length}</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Client Users
							</CardTitle>
							<Users className="h-4 w-4 text-blue-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{users.filter((u) => u.role === "client").length}
							</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Staff Users</CardTitle>
							<Users className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{users.filter((u) => u.role === "palogistica").length}
							</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Companies</CardTitle>
							<Building className="h-4 w-4 text-purple-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-600">
								{companies.length}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Actions and Filters */}
				<Card className="slide-up">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
							<div className="flex flex-col md:flex-row gap-4 flex-1">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										placeholder="Search users..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
								<Select value={roleFilter} onValueChange={setRoleFilter}>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Filter by role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Roles</SelectItem>
										<SelectItem value="client">Client Users</SelectItem>
										<SelectItem value="palogistica">Staff Users</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex gap-2">
								<Dialog
									open={isAddCompanyDialogOpen}
									onOpenChange={setIsAddCompanyDialogOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">
											<Building className="h-4 w-4 mr-2" />
											Add Company
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Add New Company</DialogTitle>
											<DialogDescription>
												Create a new client company.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<Label htmlFor="companyName">Company Name *</Label>
												<Input
													id="companyName"
													value={newCompany.name}
													onChange={(e) =>
														setNewCompany((prev) => ({
															...prev,
															name: e.target.value,
														}))
													}
												/>
											</div>
											<div>
												<Label htmlFor="companyEmail">Email *</Label>
												<Input
													id="companyEmail"
													type="email"
													value={newCompany.email}
													onChange={(e) =>
														setNewCompany((prev) => ({
															...prev,
															email: e.target.value,
														}))
													}
												/>
											</div>
											<div>
												<Label htmlFor="companyPhone">Phone</Label>
												<Input
													id="companyPhone"
													value={newCompany.phone}
													onChange={(e) =>
														setNewCompany((prev) => ({
															...prev,
															phone: e.target.value,
														}))
													}
												/>
											</div>
											<div>
												<Label htmlFor="companyAddress">Address</Label>
												<Input
													id="companyAddress"
													value={newCompany.address}
													onChange={(e) =>
														setNewCompany((prev) => ({
															...prev,
															address: e.target.value,
														}))
													}
												/>
											</div>
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													onClick={() => setIsAddCompanyDialogOpen(false)}>
													Cancel
												</Button>
												<Button
													onClick={handleAddCompany}
													disabled={!newCompany.name || !newCompany.email}>
													Add Company
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>

								<Dialog
									open={isAddUserDialogOpen}
									onOpenChange={setIsAddUserDialogOpen}>
									<DialogTrigger asChild>
										<Button>
											<Plus className="h-4 w-4 mr-2" />
											Add User
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Add New User</DialogTitle>
											<DialogDescription>
												Create a new user account.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<Label htmlFor="userName">Name *</Label>
												<Input
													id="userName"
													value={newUser.name}
													onChange={(e) =>
														setNewUser((prev) => ({
															...prev,
															name: e.target.value,
														}))
													}
												/>
											</div>
											<div>
												<Label htmlFor="userEmail">Email *</Label>
												<Input
													id="userEmail"
													type="email"
													value={newUser.email}
													onChange={(e) =>
														setNewUser((prev) => ({
															...prev,
															email: e.target.value,
														}))
													}
												/>
											</div>
											<div>
												<Label htmlFor="userRole">Role *</Label>
												<Select
													value={newUser.role}
													onValueChange={(value: "client" | "palogistica") =>
														setNewUser((prev) => ({
															...prev,
															role: value,
															companyId: "",
														}))
													}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="client">Client User</SelectItem>
														<SelectItem value="palogistica">
															Staff User
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											{newUser.role === "client" && (
												<div>
													<Label htmlFor="userCompany">Company *</Label>
													<Select
														value={newUser.companyId}
														onValueChange={(value) =>
															setNewUser((prev) => ({
																...prev,
																companyId: value,
															}))
														}>
														<SelectTrigger>
															<SelectValue placeholder="Select company" />
														</SelectTrigger>
														<SelectContent>
															{companies.map((company) => (
																<SelectItem key={company.id} value={company.id}>
																	{company.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											)}
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													onClick={() => setIsAddUserDialogOpen(false)}>
													Cancel
												</Button>
												<Button
													onClick={handleAddUser}
													disabled={
														!newUser.name ||
														!newUser.email ||
														(newUser.role === "client" && !newUser.companyId)
													}>
													Add User
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Users Table */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Users ({filteredUsers.length})</CardTitle>
						<CardDescription>
							Manage user accounts and permissions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
									<div className="flex items-center gap-4">
										<Avatar>
											<AvatarImage src={user.avatar || "/placeholder.svg"} />
											<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold">{user.name}</h3>
												<Badge
													variant={
														user.status === "active" ? "default" : "secondary"
													}
													className={
														user.status === "active"
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}>
													{user.status}
												</Badge>
												<Badge variant="outline">
													{user.role === "client" ? "Client" : "Staff"}
												</Badge>
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-400">
												<p>{user.email}</p>
												{user.companyName && <p>Company: {user.companyName}</p>}
												<p>Last login: {user.lastLogin.toLocaleDateString()}</p>
											</div>
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>
												<Edit className="h-4 w-4 mr-2" />
												Edit User
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleToggleUserStatus(user.id)}>
												{user.status === "active" ? "Deactivate" : "Activate"}
											</DropdownMenuItem>
											<DropdownMenuItem className="text-red-600">
												<Trash2 className="h-4 w-4 mr-2" />
												Delete User
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Companies Section */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Companies ({companies.length})</CardTitle>
						<CardDescription>Manage client companies</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{companies.map((company) => (
								<div
									key={company.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
											<Building className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold">{company.name}</h3>
												<Badge
													variant={
														company.status === "active"
															? "default"
															: "secondary"
													}
													className={
														company.status === "active"
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}>
													{company.status}
												</Badge>
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-400">
												<p>{company.email}</p>
												<p>{company.phone}</p>
												<p>Created: {company.createdAt.toLocaleDateString()}</p>
											</div>
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>
												<Edit className="h-4 w-4 mr-2" />
												Edit Company
											</DropdownMenuItem>
											<DropdownMenuItem>
												{company.status === "active"
													? "Deactivate"
													: "Activate"}
											</DropdownMenuItem>
											<DropdownMenuItem className="text-red-600">
												<Trash2 className="h-4 w-4 mr-2" />
												Delete Company
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
