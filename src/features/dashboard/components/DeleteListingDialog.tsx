"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";

interface DeleteListingDialogProps {
  listingId: string;
  listingTitle: string;
}

export function DeleteListingDialog({
  listingId,
  listingTitle,
}: DeleteListingDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("path")
      .eq("product_id", listingId);

    if (imagesError) {
      setIsDeleting(false);
      toast.error(imagesError.message);
      return;
    }

    const imagePaths = images?.map((image) => image.path).filter(Boolean) ?? [];

    if (imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove(imagePaths);

      if (storageError) {
        setIsDeleting(false);
        toast.error(storageError.message);
        return;
      }
    }

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", listingId);

    setIsDeleting(false);

    if (productError) {
      toast.error(productError.message);
      return;
    }

    toast.success("Listing deleted");
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-white text-text-muted transition hover:border-error hover:text-error"
          aria-label="Delete listing"
          title="Delete listing"
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-[28px] border-border bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-3 text-text-strong">
            Delete listing?
          </AlertDialogTitle>

          <AlertDialogDescription className="body-2 text-text-muted">
            This will permanently delete{" "}
            <span className="font-semibold text-text-strong">
              {listingTitle}
            </span>
            , including its uploaded product photos. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel className="button-text h-11 rounded-button border-border bg-white px-5 text-text-strong hover:border-brand hover:text-brand">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="button-text h-11 rounded-button bg-error px-5 text-white hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? "Deleting..." : "Delete listing"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
