// /app/admin/brands/page.tsx

import BrandTableClient from "./brandTableClient";

// Questa è una Server Component. È leggera e veloce da caricare.
export default function BrandsPage() {
  return (
    <div>
      {/* Qui puoi aggiungere altri elementi della pagina che beneficiano
        del rendering lato server, come titoli, descrizioni, ecc.
      */}
      <BrandTableClient />
    </div>
  );
}
