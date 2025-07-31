"use client";

import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
	status: OrderStatus;
	className?: string;
}

const statusConfig = {
	pending: {
		label: "Pending",
		className:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
	},
	confirmed: {
		label: "Confirmed",
		className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	},
	in_progress: {
		label: "In Progress",
		className:
			"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
	},
	delivered: {
		label: "Delivered",
		className:
			"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	},
	issue_reported: {
		label: "Issue Reported",
		className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
	},
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<Badge
			className={cn(config.className, "status-transition", className)}
			variant="secondary">
			{config.label}
		</Badge>
	);
}
