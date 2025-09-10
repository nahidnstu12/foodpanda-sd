import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DateRangeFilter, FilterValue } from "@/helpers/datatable.type";
import {
  generateApiUrlParams,
  generateBrowserUrlParams,
} from "@/helpers/filterUtils";

export type TableState = {
  page: number;
  page_size: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  filters?: Record<string, FilterValue | DateRangeFilter>;
};

type DatatableState = Record<string, TableState>;

type SetParamsPayload = {
  key: string;
  params: Partial<TableState>;
};

type InitPayload = {
  key: string;
  initial: TableState;
};

type Store = {
  tables: DatatableState;
  initTable: (payload: InitPayload) => void;
  setTableParams: (payload: SetParamsPayload) => void;
  resetTable: (key: string) => void;
};

export const DEFAULT_TABLE_STATE: TableState = {
  page: 1,
  page_size: 10,
  sort: undefined,
  order: undefined,
  search: undefined,
  status: undefined,
  filters: undefined,
};

export const useDatatableStore = create<Store>()(
  devtools((set) => ({
    tables: {},
    initTable: ({ key, initial }) =>
      set(
        (state) => {
          if (state.tables[key]) return state;
          return { tables: { ...state.tables, [key]: { ...initial } } };
        },
        false,
        { type: "datatable/initTable", key }
      ),
    setTableParams: ({ key, params }) =>
      set(
        (state) => {
          const current = state.tables[key] ?? { ...DEFAULT_TABLE_STATE };
          const next: TableState = { ...current };
          Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === "" || v === "all") {
              // @ts-expect-error dynamic
              delete next[k];
            } else {
              // @ts-expect-error dynamic
              next[k] = v as any;
            }
          });
          return { tables: { ...state.tables, [key]: next } };
        },
        false,
        { type: "datatable/setTableParams", key }
      ),
    resetTable: (key) =>
      set(
        (state) => ({
          tables: {
            ...state.tables,
            [key]: { page: 1, page_size: 10, filters: undefined },
          },
        }),
        false,
        { type: "datatable/resetTable", key }
      ),
  }))
);

export function selectTableState(state: Store, key: string): TableState {
  return state.tables[key] ?? DEFAULT_TABLE_STATE;
}

// Helpers to build query params from a table state, matching API format
export function buildApiQueryFromState(state: TableState): string {
  const params = new URLSearchParams();

  // sort
  if (state.sort) {
    const sortVal = state.order === "desc" ? `-${state.sort}` : state.sort;
    params.set("sort", sortVal);
  }

  // pagination mapping
  if (typeof state.page_size === "number")
    params.set("page[limit]", String(state.page_size));
  // Assume offset = (page - 1) * page_size
  if (typeof state.page === "number" && typeof state.page_size === "number") {
    const offset = Math.max(0, (state.page - 1) * state.page_size);
    params.set("page[offset]", String(offset));
  }

  // filters
  if (state.filters) {
    const filterParams: URLSearchParams = generateApiUrlParams(state.filters);
    for (const [k, v] of filterParams.entries()) params.append(k, v);
  }

  return params.toString();
}

// Optional: browser-friendly query (no operators inside values, uses _from/_to)
export function buildBrowserQueryFromState(state: TableState): string {
  const params = new URLSearchParams();

  if (state.sort) {
    const sortVal = state.order === "desc" ? `-${state.sort}` : state.sort;
    params.set("sort", sortVal);
  }
  if (typeof state.page_size === "number")
    params.set("page[limit]", String(state.page_size));
  if (typeof state.page === "number" && typeof state.page_size === "number") {
    const offset = Math.max(0, (state.page - 1) * state.page_size);
    params.set("page[offset]", String(offset));
  }

  if (state.filters) {
    const filterParams: URLSearchParams = generateBrowserUrlParams(
      state.filters
    );
    for (const [k, v] of filterParams.entries()) params.append(k, v);
  }

  return params.toString();
}
