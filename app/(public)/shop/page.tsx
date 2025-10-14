import ProductCard from "@/app/components/cards/ProductCard";
export default function Shop() {
  return (
    <div>
      <h1>Shop page</h1>
      <div className="w-full mx-auto">
        <div className="flex flex-wrap justify-center gap-8 m-3">
          <div className="max-w-20">
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  );
}
