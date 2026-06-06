import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/actions/order/update-status";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } } },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const total = order.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>₹{total.toFixed(2)}</TableCell>
                  <TableCell>
                    {/* Server Action Form Wrapper */}
                    <form action={async (formData) => {
                      "use server";
                      const status = formData.get("status") as string;
                      await updateOrderStatus(order.id, status);
                    }}>
                      <Select name="status" defaultValue={order.status}>
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
                      {/* Hidden submit button triggered by JS or manual enter */}
                      <button type="submit" className="hidden" id={`submit-${order.id}`}>Save</button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}