import prisma from '@/shared/prisma';

const deleteCustomer = async (id: number) => {
  await prisma.customer.update({
    where: { id },
    data: {
      is_deleted: true,
      is_active: false,
    },
  });
};

export { deleteCustomer };
