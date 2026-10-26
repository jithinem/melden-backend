import prisma from '@/shared/prisma';

const createCustomer = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  gst_number?: string | null;
  is_active?: boolean;
}) => {
  const customer = await prisma.customer.create({
    data: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone_number: payload.phone_number,
      gst_number: payload.gst_number,
      is_active: payload.is_active ?? true,
      is_deleted: false,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone_number: true,
      gst_number: true,
      is_active: true,
      is_deleted: true,
      created_at: true,
      updated_at: true,
    },
  });

  return customer;
};

export { createCustomer };
