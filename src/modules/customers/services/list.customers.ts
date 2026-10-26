import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/shared/prisma';

interface ListCustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

const listCustomers = async (query: ListCustomersQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {
    is_deleted: false,
  };

  if (typeof query.is_active === 'boolean') {
    where.is_active = query.is_active;
  }

  if (query.search) {
    where.OR = [
      { first_name: { contains: query.search, mode: 'insensitive' } },
      { last_name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { gst_number: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        gst_number: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    items,
    rows: items,
    data: items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export { listCustomers };
export type { ListCustomersQuery };
