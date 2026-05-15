import {
  createListingSchema,
  type CreateListingFormInput,
  type CreateListingFormValues,
} from "@/features/products/create-listing-schema";

export const editListingSchema = createListingSchema;

export type EditListingFormInput = CreateListingFormInput;
export type EditListingFormValues = CreateListingFormValues;
