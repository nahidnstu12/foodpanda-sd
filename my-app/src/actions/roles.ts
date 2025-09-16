"use server";

import {
  buildOrderBy,
  buildWhereFromFilters,
  paginatePrisma,
} from "@/lib/datatable";
import db from "@/lib/prisma";

export async function roleListWithPagination(params: any) {
  const { page, page_size, sort, order, filters } = params ?? {};

  const where = buildWhereFromFilters(filters);
  const orderBy = buildOrderBy(sort, order);

  const { items, pagination } = await paginatePrisma(
    db.role,
    { where, orderBy },
    { page, page_size, sort, order, filters }
  );

  return { items, pagination };
}
