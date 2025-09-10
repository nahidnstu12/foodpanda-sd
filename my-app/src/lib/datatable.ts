import type { Prisma } from "@prisma/client";
import type { DateRangeFilter, FilterValue } from "@/helpers/datatable.type";

export type TableParams = {
  page?: number;
  page_size?: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, FilterValue | DateRangeFilter>;
};

export type PageMeta = {
  total_records: number;
  page_size: number;
  current_page: number;
  total_pages: number;
};

export function toPageMeta(
  total: number,
  page: number,
  pageSize: number
): PageMeta {
  const size = Math.max(1, pageSize || 10);
  const current = Math.max(1, page || 1);
  const totalPages = Math.max(1, Math.ceil(total / size));
  return {
    total_records: total,
    page_size: size,
    current_page: Math.min(current, totalPages),
    total_pages: totalPages,
  };
}

export function buildOrderBy(
  sort?: string,
  order?: "asc" | "desc"
): any | undefined {
  if (!sort) return undefined;
  const direction: Prisma.SortOrder = order === "desc" ? "desc" : "asc";
  // Support nested sort like "organization.name"
  if (sort.includes(".")) {
    const parts = sort.split(".");
    if (parts.length === 2) {
      const [rel, field] = parts as [string, string];
      return { [rel]: { [field]: direction } } as any;
    }
  }
  return { [sort]: direction } as any;
}

export function buildWhereFromFilters(
  filters?: Record<string, FilterValue | DateRangeFilter>
): any {
  if (!filters) return undefined;
  const where: any = {};

  for (const [field, filter] of Object.entries(filters)) {
    if (!filter) continue;
    if ((filter as DateRangeFilter).operator === "daterange") {
      const fr = filter as DateRangeFilter;
      // Support nested relation date fields: relation.field
      const setOp = (op: "gte" | "lte", val: string) => {
        if (field.includes(".")) {
          const [rel, f] = field.split(".");
          where[rel] = where[rel] || {};
          where[rel][f] = { ...(where[rel][f] || {}), [op]: val };
        } else {
          where[field] = { ...(where[field] || {}), [op]: val };
        }
      };
      if (fr.from) setOp("gte", fr.from);
      if (fr.to) setOp("lte", fr.to);
      continue;
    }

    const f = filter as FilterValue;
    if (f.value === undefined || f.value === null || f.value === "") continue;

    // "input" => contains, "select" => equals, "date" => equals
    if (f.operator === "input") {
      if (field.includes(".")) {
        const [rel, fld] = field.split(".");
        where[rel] = where[rel] || {};
        where[rel][fld] = { contains: String(f.value), mode: "insensitive" };
      } else {
        where[field] = { contains: String(f.value), mode: "insensitive" };
      }
    } else if (f.operator === "select" || f.operator === "date") {
      if (field.includes(".")) {
        const [rel, fld] = field.split(".");
        where[rel] = where[rel] || {};
        where[rel][fld] = { equals: f.value };
      } else {
        where[field] = { equals: f.value };
      }
    }
  }

  return where;
}

export async function paginatePrisma<T>(
  delegate: {
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  },
  args: {
    where?: any;
    orderBy?: any;
    select?: any;
    include?: any;
  },
  params: TableParams
): Promise<{ items: T[]; pagination: PageMeta }> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.page_size || 10);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [items, total] = await Promise.all([
    delegate.findMany({ ...args, skip, take }),
    delegate.count({ where: args.where }),
  ]);

  return { items, pagination: toPageMeta(total, page, pageSize) };
}
