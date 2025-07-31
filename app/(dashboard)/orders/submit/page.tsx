"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
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
import { toast } from "sonner";
import { Loader2, Package } from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import { DashboardHeader } from "@/components/dashboard-header";

export default function SubmitOrderPage() {
	const { user } = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const containerRef = useGSAP();

	const [formData, setFormData] = useState({
		customerName: "",
		customerPhone: "",
		customerEmail: "",
		pickupAddress: "",
		deliveryAddress: "",
		packageDetails: "",
		weight: "",
		dimensions: "",
		specialInstructions: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Generate tracking number
		const trackingNumber = `PLG-${new Date().getFullYear()}-${String(
			Math.floor(Math.random() * 1000)
		).padStart(3, "0")}`;

		toast(
			`Order submitted successfully! Your tracking number is ${trackingNumber}`
		);

		setIsSubmitting(false);
		router.push("/orders");
	};

	return (
		<>
			<DashboardHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Orders", href: "/orders" },
					{ label: "Submit Order" },
				]}
			/>

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">
						Submit New Order
					</h2>
					<p className="text-muted-foreground">
						Fill out the form below to request a new delivery
					</p>
				</div>

				<Card className="slide-up max-w-4xl">
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Package className="h-5 w-5" />
							<span>Delivery Details</span>
						</CardTitle>
						<CardDescription>
							Please provide accurate information for successful delivery
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Customer Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="customerName">Customer Name *</Label>
									<Input
										id="customerName"
										name="customerName"
										value={formData.customerName}
										onChange={handleInputChange}
										required
										placeholder="Enter customer name"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="customerPhone">Customer Phone *</Label>
									<Input
										id="customerPhone"
										name="customerPhone"
										type="tel"
										value={formData.customerPhone}
										onChange={handleInputChange}
										required
										placeholder="+1-555-0123"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="customerEmail">Customer Email</Label>
								<Input
									id="customerEmail"
									name="customerEmail"
									type="email"
									value={formData.customerEmail}
									onChange={handleInputChange}
									placeholder="customer@example.com"
								/>
							</div>

							{/* Addresses */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="pickupAddress">Pickup Address *</Label>
									<Textarea
										id="pickupAddress"
										name="pickupAddress"
										value={formData.pickupAddress}
										onChange={handleInputChange}
										required
										placeholder="Enter complete pickup address"
										rows={3}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="deliveryAddress">Delivery Address *</Label>
									<Textarea
										id="deliveryAddress"
										name="deliveryAddress"
										value={formData.deliveryAddress}
										onChange={handleInputChange}
										required
										placeholder="Enter complete delivery address"
										rows={3}
									/>
								</div>
							</div>

							{/* Package Details */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="packageDetails">Package Details *</Label>
									<Input
										id="packageDetails"
										name="packageDetails"
										value={formData.packageDetails}
										onChange={handleInputChange}
										required
										placeholder="e.g., Electronics, Documents, Clothing"
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="weight">Weight (kg) *</Label>
										<Input
											id="weight"
											name="weight"
											type="number"
											step="0.1"
											value={formData.weight}
											onChange={handleInputChange}
											required
											placeholder="0.0"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="dimensions">
											Dimensions (L x W x H cm) *
										</Label>
										<Input
											id="dimensions"
											name="dimensions"
											value={formData.dimensions}
											onChange={handleInputChange}
											required
											placeholder="e.g., 30x20x10"
										/>
									</div>
								</div>
							</div>

							{/* Special Instructions */}
							<div className="space-y-2">
								<Label htmlFor="specialInstructions">
									Special Instructions
								</Label>
								<Textarea
									id="specialInstructions"
									name="specialInstructions"
									value={formData.specialInstructions}
									onChange={handleInputChange}
									placeholder="Any special handling requirements or delivery instructions"
									rows={3}
								/>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="bg-blue-600 hover:bg-blue-700">
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Submitting...
										</>
									) : (
										"Submit Order"
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
