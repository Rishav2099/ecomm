"use client";

import { createProduct } from "@/actions/product/create-product";
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
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Please upload an image"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

const NewProduct = () => {
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      stock: 10,
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully!");
      form.reset();
      setImageUrl("");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <div>
      <Card className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
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
                className="mt-4 h-40 rounded-lg object-cover"
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
                <Input
                  {...field}
                  id="name"
                  placeholder="Macbook Air M4"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
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
                <Textarea
                  {...field}
                  id="description"
                  rows={5}
                  placeholder="Write product description..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Price */}
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
                  placeholder="99.99"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Stock */}
          <Controller
            name="stock"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="stock">Inventory Stock</Label>
                <Input
                  {...field}
                  id="stock"
                  type="number"
                  placeholder="10"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Category */}
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  {...field}
                  id="category"
                  type="text"
                  placeholder="Electronics"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default NewProduct;
