import FeaturedManager from "@/app/components/admin/FeaturedManager";

export default function FeaturedPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Featured Drops<span className="text-amber-500">.</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl">
          Seleziona i prodotti da mostrare nella sezione &quot;New
          Arrivals&quot; della homepage. Clicca sulla stella o sulla card per
          attivare/disattivare.
        </p>
      </div>

      <FeaturedManager />
    </div>
  );
}
