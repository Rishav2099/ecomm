"use client";

import { productSchema, ProductSchemaType } from "@/components/new-product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/components/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Product } from "@/generated/prisma/client";
import { updateProduct } from "@/actions/product/create-product";

interface EditProductFormProps {
  initialData: Product;
}

export default function EditProductForm({ initialData }: EditProductFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialData.image || "");

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || "",
      price: Number(initialData.price),
      category: initialData.category,
      image: initialData.image || "",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      await updateProduct(initialData.id, data);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload & Preview */}
        <div className="space-y-2">
          <Label>Product Image</Label>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageUrl(res[0].ufsUrl);
              form.setValue("image", res[0].ufsUrl, { shouldValidate: true });
              toast.success("Image uploaded successfully");
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-4 h-40 rounded-lg object-cover border border-border"
            />
          )}
          {form.formState.errors.image && (
            <p className="text-sm text-destructive">
              {form.formState.errors.image.message}
            </p>
          )}
        </div>

        {/* Product Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea {...field} id="description" rows={5} aria-invalid={fieldState.invalid} />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        {/* Price & Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  {...field}
                  id="price"
                  type="number"
                  step="0.01"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input {...field} id="category" aria-invalid={fieldState.invalid} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}