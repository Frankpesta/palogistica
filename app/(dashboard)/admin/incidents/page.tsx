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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { mockIncidents } from "@/lib/mock-data";
import type { Incident } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";
import { toast } from "sonner";

export default function AdminIncidentsPage() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [severityFilter, setSeverityFilter] = useState<string>("all");
	const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
	const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
		null
	);
	const [resolution, setResolution] = useState("");
	const containerRef = useGSAP();

	useEffect(() => {
		// Add more mock incidents for demonstration
		const additionalIncidents: Incident[] = [
			{
				id: "INC-002",
				orderId: "ORD-002",
				title: "Package Damaged",
				description:
					"Package was damaged during transport - corner of box crushed",
				severity: "high",
				status: "open",
				reportedBy: "Sarah Chen",
				reportedAt: new Date("2024-01-15T10:30:00"),
			},
			{
				id: "INC-003",
				orderId: "ORD-003",
				title: "Customer Not Available",
				description:
					"Customer not available at delivery address, multiple attempts made",
				severity: "medium",
				status: "in_progress",
				reportedBy: "David Park",
				reportedAt: new Date("2024-01-15T16:45:00"),
			},
			{
				id: "INC-004",
				orderId: "ORD-001",
				title: "Vehicle Breakdown",
				description: "Delivery vehicle broke down, causing significant delay",
				severity: "high",
				status: "resolved",
				reportedBy: "Mike Rodriguez",
				reportedAt: new Date("2024-01-14T14:20:00"),
				resolvedAt: new Date("2024-01-14T18:30:00"),
				resolution:
					"Backup vehicle dispatched, delivery completed successfully",
			},
		];

		const allIncidents = [...mockIncidents, ...additionalIncidents];
		setIncidents(allIncidents);
		setFilteredIncidents(allIncidents);
	}, []);

	useEffect(() => {
		let filtered = incidents;

		if (searchTerm) {
			filtered = filtered.filter(
				(incident) =>
					incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					incident.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					incident.orderId.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(incident) => incident.status === statusFilter
			);
		}

		if (severityFilter !== "all") {
			filtered = filtered.filter(
				(incident) => incident.severity === severityFilter
			);
		}

		setFilteredIncidents(filtered);
	}, [searchTerm, statusFilter, severityFilter, incidents]);

	const handleResolveIncident = () => {
		if (!selectedIncident || !resolution.trim()) return;

		setIncidents((prev) =>
			prev.map((incident) =>
				incident.id === selectedIncident.id
					? {
							...incident,
							status: "resolved" as const,
							resolvedAt: new Date(),
							resolution: resolution.trim(),
					  }
					: incident
			)
		);

		toast(`Incident ${selectedIncident.id} has been marked as resolved.`);

		setIsResolveDialogOpen(false);
		setSelectedIncident(null);
		setResolution("");
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "high":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "open":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "in_progress":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "resolved":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const breadcrumbs = [
		{ label: "Admin Dashboard", href: "/admin" },
		{ label: "Incidents" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">
						Incident Management
					</h2>
					<p className="text-muted-foreground">
						Track and resolve delivery incidents
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Incidents
							</CardTitle>
							<AlertTriangle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{incidents.length}</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Open</CardTitle>
							<AlertTriangle className="h-4 w-4 text-red-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">
								{incidents.filter((i) => i.status === "open").length}
							</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">In Progress</CardTitle>
							<Clock className="h-4 w-4 text-blue-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{incidents.filter((i) => i.status === "in_progress").length}
							</div>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Resolved</CardTitle>
							<CheckCircle className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{incidents.filter((i) => i.status === "resolved").length}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="slide-up">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search incidents..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full md:w-48">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="open">Open</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="resolved">Resolved</SelectItem>
								</SelectContent>
							</Select>
							<Select value={severityFilter} onValueChange={setSeverityFilter}>
								<SelectTrigger className="w-full md:w-48">
									<SelectValue placeholder="Filter by severity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Severities</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="low">Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Incidents List */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Incidents ({filteredIncidents.length})</CardTitle>
						<CardDescription>
							Manage and resolve delivery incidents
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredIncidents.map((incident) => (
								<div
									key={incident.id}
									className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-semibold">{incident.title}</h3>
												<Badge
													className={getSeverityColor(incident.severity)}
													variant="secondary">
													{incident.severity.toUpperCase()}
												</Badge>
												<Badge
													className={getStatusColor(incident.status)}
													variant="secondary">
													{incident.status.replace("_", " ").toUpperCase()}
												</Badge>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
												{incident.description}
											</p>
											<div className="flex items-center gap-4 text-xs text-gray-500">
												<span>Order: {incident.orderId}</span>
												<span>Reported by: {incident.reportedBy}</span>
												<span>
													Date: {incident.reportedAt.toLocaleDateString()}
												</span>
												{incident.resolvedAt && (
													<span>
														Resolved: {incident.resolvedAt.toLocaleDateString()}
													</span>
												)}
											</div>
										</div>
										<div className="flex gap-2">
											{incident.status !== "resolved" && (
												<Button
													size="sm"
													onClick={() => {
														setSelectedIncident(incident);
														setIsResolveDialogOpen(true);
													}}>
													Resolve
												</Button>
											)}
										</div>
									</div>
									{incident.resolution && (
										<div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
											<p className="text-sm">
												<strong>Resolution:</strong> {incident.resolution}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Resolve Incident Dialog */}
				<Dialog
					open={isResolveDialogOpen}
					onOpenChange={setIsResolveDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Resolve Incident</DialogTitle>
							<DialogDescription>
								Provide details about how this incident was resolved.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="resolution">Resolution Details</Label>
								<Textarea
									id="resolution"
									placeholder="Describe how the incident was resolved..."
									value={resolution}
									onChange={(e) => setResolution(e.target.value)}
									rows={4}
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setIsResolveDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									onClick={handleResolveIncident}
									disabled={!resolution.trim()}>
									Mark as Resolved
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
