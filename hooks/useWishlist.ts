"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useClerk } from "@clerk/nextjs";
import { ListingWithDetails } from "@/app/lib/types/type";
import { toast } from "sonner"; // O il tuo sistema di toast preferito

export function useWishlist() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();

  // 1. Fetch Wishlist
  const { data: wishlistListings = [], isLoading } = useQuery<
    ListingWithDetails[]
  >({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isSignedIn, // Esegui solo se loggato
    staleTime: 1000 * 60 * 5, // Cache per 5 minuti
  });

  // Helper per controllare se un ID è nella wishlist
  const isInWishlist = (listingId: string) => {
    return wishlistListings.some((item) => item.id === listingId);
  };

  // 2. Mutation Toggle
  const { mutate: toggleWishlist, isPending } = useMutation({
    mutationFn: async (listingId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) throw new Error("Errore wishlist");
      return res.json();
    },
    onMutate: async (listingId) => {
      // --- OPTIMISTIC UPDATE (Feedback istantaneo) ---
      // Cancella query in corso
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot dello stato precedente
      const previousWishlist = queryClient.getQueryData<ListingWithDetails[]>([
        "wishlist",
      ]);

      // Aggiorna la cache localmente
      queryClient.setQueryData<ListingWithDetails[]>(
        ["wishlist"],
        (old = []) => {
          const exists = old.find((item) => item.id === listingId);
          if (exists) {
            // Rimuovi
            return old.filter((item) => item.id !== listingId);
          } else {
            // Aggiungi (Nota: qui servirebbe l'oggetto listing completo per aggiungerlo alla UI,
            // ma per il cuoricino basta sapere che l'ID c'è.
            // Per evitare complessità, nella view "Griglia" non aggiungiamo ottimisticamente l'intera card,
            // ma gestiamo solo lo stato "liked").
            return old;
          }
        },
      );

      return { previousWishlist };
    },
    onError: (err, newTodo, context) => {
      // Rollback in caso di errore
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      toast.error("Impossibile aggiornare la wishlist");
    },
    onSettled: () => {
      // Risincronizza con il server
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Wrapper function che gestisce anche il redirect al login
  const handleToggle = (e: React.MouseEvent, listingId: string) => {
    e.preventDefault(); // Previene il click sul Link della card
    e.stopPropagation();

    if (!isSignedIn) {
      openSignIn(); // Apre il modale di Clerk
      return;
    }

    toggleWishlist(listingId);
  };

  return {
    wishlistListings,
    isLoading,
    isInWishlist,
    handleToggle,
    isPending,
  };
}
