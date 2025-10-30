// app/listings/[listingId]/page.tsx
// (Esempio di come usare il form)

import PhotoUploadForm from "@/app/components/photos/PhotoUploadForm";

// Supponiamo che questa sia una pagina server che ottiene i dati
async function getListingData(id: string) {
  return {
    id: "cmgtqpduz0008bnfkxax3noih",
    description: "Un listing di esempio",
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: { listingId: string };
}) {
  const listing = await getListingData(params.listingId);

  return (
    <div>
      <h1>Dettagli Listing: {listing.description}</h1>
      <p>ID: {listing.id}</p>

      <hr style={{ margin: "2rem 0" }} />

      {/* Qui usi il form. 
        Passi l'ID del listing corrente come prop.
      */}
      <PhotoUploadForm listingId={listing.id} />

      <hr style={{ margin: "2rem 0" }} />

      {/* Qui potresti mostrare le foto già caricate... */}
    </div>
  );
}
