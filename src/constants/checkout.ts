export const deliveryMethods = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "Estimated delivery in 3-5 business days",
    price: 6,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "Estimated delivery in 1-2 business days",
    price: 12,
  },
  {
    id: "pickup",
    label: "Pickup",
    description: "Arrange pickup directly with the seller",
    price: 0,
  },
] as const;

export const DEFAULT_DELIVERY_METHOD = "standard";
