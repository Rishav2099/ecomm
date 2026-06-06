import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Please upload an image"),
});

export type ProductSchemaType = z.infer<typeof productSchema>;