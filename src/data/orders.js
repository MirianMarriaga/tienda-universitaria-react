export const orders = [
  {
    id: 1001,
    customerId: 1,
    addressId: 1,
    status: "CREATED",
    total: 140000,
    items: [
      { id: 1, orderId: 1001, productId: 1, productName: "Sudadera institucional", quantity: 1, unitPrice: 95000, subtotal: 95000, createdAt: "2026-05-11T10:00:00Z" },
      { id: 2, orderId: 1001, productId: 4, productName: "Cuaderno Unimag", quantity: 1, unitPrice: 18000, subtotal: 18000, createdAt: "2026-05-11T10:00:00Z" },
      { id: 3, orderId: 1001, productId: 5, productName: "Mug institucional", quantity: 1, unitPrice: 25000, subtotal: 25000, createdAt: "2026-05-11T10:00:00Z" },
      { id: 4, orderId: 1001, productId: 4, productName: "Cuaderno Unimag", quantity: 1, unitPrice: 18000, subtotal: 18000, createdAt: "2026-05-11T10:00:00Z" }
    ],
    createdAt: "2026-05-11T10:00:00Z",
    updatedAt: "2026-05-11T10:00:00Z"
  },
  {
    id: 1002,
    customerId: 2,
    addressId: 2,
    status: "PAID",
    total: 95000,
    items: [
      { id: 5, orderId: 1002, productId: 1, productName: "Sudadera institucional", quantity: 1, unitPrice: 95000, subtotal: 95000, createdAt: "2026-05-09T11:00:00Z" }
    ],
    createdAt: "2026-05-09T11:00:00Z",
    updatedAt: "2026-05-09T12:00:00Z"
  },
  {
    id: 1003,
    customerId: 3,
    addressId: 3,
    status: "SHIPPED",
    total: 156000,
    items: [
      { id: 6, orderId: 1003, productId: 3, productName: "Kit Bienvenida Ingeniería", quantity: 1, unitPrice: 120000, subtotal: 120000, createdAt: "2026-05-07T09:00:00Z" },
      { id: 7, orderId: 1003, productId: 4, productName: "Cuaderno Unimag", quantity: 2, unitPrice: 18000, subtotal: 36000, createdAt: "2026-05-07T09:00:00Z" }
    ],
    createdAt: "2026-05-07T09:00:00Z",
    updatedAt: "2026-05-07T14:00:00Z"
  },
  {
    id: 1004,
    customerId: 1,
    addressId: 1,
    status: "DELIVERED",
    total: 45000,
    items: [
      { id: 8, orderId: 1004, productId: 2, productName: "Libro Cálculo I", quantity: 1, unitPrice: 45000, subtotal: 45000, createdAt: "2026-04-28T08:00:00Z" }
    ],
    createdAt: "2026-04-28T08:00:00Z",
    updatedAt: "2026-04-28T16:00:00Z"
  },
  {
    id: 1005,
    customerId: 5,
    addressId: 5,
    status: "CANCELLED",
    total: 25000,
    items: [
      { id: 9, orderId: 1005, productId: 5, productName: "Mug institucional", quantity: 1, unitPrice: 25000, subtotal: 25000, createdAt: "2026-05-02T10:00:00Z" }
    ],
    createdAt: "2026-05-02T10:00:00Z",
    updatedAt: "2026-05-02T11:00:00Z"
  }
]