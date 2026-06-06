import NewProduct from "@/components/new-product";

const page = async () => {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Add New Product</h1>

      <NewProduct />
    </div>
  );
};

export default page;
