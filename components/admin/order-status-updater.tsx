"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/order/update-status";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function OrderStatusUpdater({ 
  orderId, 
  currentStatus 
}: { 
  orderId: number; 
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order #${orderId} updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        defaultValue={currentStatus} 
        onValueChange={handleStatusChange} 
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="PROCESSING">Processing</SelectItem>
          <SelectItem value="SHIPPED">Shipped</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Show a spinner while the server action runs */}
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}