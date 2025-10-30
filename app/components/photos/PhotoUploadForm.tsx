// app/components/PhotoUploadForm.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";

// Il componente ha bisogno di sapere a quale listing associare le foto.
interface PhotoUploadFormProps {
  listingId: string;
}

export default function PhotoUploadForm({ listingId }: PhotoUploadFormProps) {
  // Stato per il file selezionato
  const [file, setFile] = useState<File | null>(null);

  // Stato per i metadati
  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [order, setOrder] = useState(0);

  // Stato per il feedback all'utente
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Gestore per l'input del file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    // Validazione semplice
    if (!file) {
      setMessage("Errore: Seleziona un file da caricare.");
      return;
    }
    if (!name) {
      setMessage("Errore: Inserisci un nome per la foto.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // 1. Costruisci il FormData
    // Questo è il corpo che l'API si aspetta
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("altText", altText);
    formData.append("isMain", String(isMain)); // Converte booleano in stringa
    formData.append("order", String(order)); // Converte numero in stringa

    try {
      // 2. Chiama l'API
      const response = await fetch(`/api/listings/${listingId}/photos`, {
        method: "POST",
        body: formData,
        // NON impostare 'Content-Type': il browser lo imposta
        // automaticamente con il 'boundary' corretto per FormData.
      });

      setIsLoading(false);

      if (response.ok) {
        const newPhoto = await response.json();
        setMessage(`Foto caricata con successo! ID: ${newPhoto.id}`);
        // Resetta il form
        setFile(null);
        setName("");
        setAltText("");
        setIsMain(false);
        setOrder(0);
        // Resetta l'input del file
        (e.target as HTMLFormElement).reset();
      } else {
        // Gestisce errori dall'API
        const errorData = await response.json();
        setMessage(`Errore: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage("Errore di rete o di connessione. Riprova.");
      console.error("Errore durante l'upload:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h3>Carica Nuova Foto</h3>

      <div>
        <label htmlFor="file">File:</label>
        <input
          id="file"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="name">Nome Foto:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="es. Vista frontale"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="altText">Testo Alternativo:</label>
        <input
          id="altText"
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="es. Scarpa Nike rossa su sfondo bianco"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="order">Ordine:</label>
        <input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          disabled={isLoading}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            disabled={isLoading}
          />
          Imposta come foto principale
        </label>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Caricamento..." : "Carica Foto"}
      </button>

      {message && (
        <p style={{ color: message.startsWith("Errore") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </form>
  );
}
