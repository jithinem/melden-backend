import prisma from '@/shared/prisma';

const updateCustomer = async (id: number, payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string | null;
  gst_number?: string | null;
  is_active?: boolean;
}) => {
  const customer = await prisma.customer.update({
    where: { id },
    data: payload,
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

export { updateCustomer };
