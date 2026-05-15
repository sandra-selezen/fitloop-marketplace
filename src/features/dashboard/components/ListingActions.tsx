"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

interface ListingActionsProps {
  listingId: string;
  status: "active" | "draft" | "sold" | "archived";
}

export function ListingActions({ listingId, status }: ListingActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isUpdating, setIsUpdating] = useState(false);

  const isArchived = status === "archived";

  const handleStatusChange = async () => {
    setIsUpdating(true);

    const nextStatus = isArchived ? "active" : "archived";

    const { error } = await supabase
      .from("products")
      .update({
        status: nextStatus,
      })
      .eq("id", listingId);

    setIsUpdating(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isArchived ? "Listing restored" : "Listing archived");
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={isUpdating}
      onClick={handleStatusChange}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-white text-text-muted transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={isArchived ? "Restore listing" : "Archive listing"}
      title={isArchived ? "Restore listing" : "Archive listing"}
    >
      {isArchived ? <RotateCcw size={16} /> : <Archive size={16} />}
    </button>
  );
}
