interface ProductDetailsProps {
  description?: string | null;
}

export function ProductDetails({ description }: ProductDetailsProps) {
  return (
    <>
      <hr className="my-6 md:my-8 border-gray-200" />

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Descrizione
        </h2>

        {description ? (
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-gray-400 italic">
            Nessuna descrizione disponibile per questo prodotto.
          </p>
        )}
      </div>
    </>
  );
}
