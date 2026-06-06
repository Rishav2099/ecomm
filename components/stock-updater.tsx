"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { updateProductStock } from "@/actions/product/update-stock";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function StockUpdater({ 
  productId, 
  initialStock 
}: { 
  productId: number; 
  initialStock: number;
}) {
  const [stock, setStock] = useState(initialStock);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    // Prevent unnecessary database calls if the number didn't change
    if (stock === initialStock) return;

    startTransition(async () => {
      const result = await updateProductStock(productId, stock);
      if (result.success) {
        toast.success("Stock updated successfully");
      } else {
        toast.error("Failed to update stock");
        setStock(initialStock); // Revert to original if it fails
      }
    });
  };

  return (
    <div className="flex items-center gap-2 max-w-[100px]">
      <Input
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
        onBlur={handleUpdate} // Saves automatically when the user clicks away
        disabled={isPending}
        className="h-8 text-center"
      />
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
    </div>
  );
}