import { TABLE_REGISTRY, TableKey } from "@/config/table-registry";
import { DateRangeFilter } from "@/helpers/datatable.type";
import {
  modalFormatToFilters,
  parseBrowserUrlToFilters,
} from "@/helpers/filterUtils";
import { selectTableState, useDatatableStore } from "@/store/datatableStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Generic data fetching function type
export type DataFetcher<T> = (params: {
  page: number;
  page_size: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
}) => Promise<{
  items: T[];
  pagination: {
    total_records: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
}>;

export interface UseTableOptions<T> {
  tableKey: TableKey;
  dataFetcher: DataFetcher<T>;
  autoFetch?: boolean; // Whether to automatically fetch data on mount/state change
  syncUrl?: boolean; // Whether to sync state with URL
}

export interface UseTableReturn<T> {
  // Data
  data: T[];
  pagination: {
    total_records: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  };
  isLoading: boolean;
  error: string | null;

  // State
  tableState: ReturnType<typeof selectTableState>;
  config: (typeof TABLE_REGISTRY)[TableKey];

  // Actions
  handleFilterChange: (newFilters: Record<string, any>) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSortChange: (sort: string, order: "asc" | "desc") => void;
  refreshData: () => Promise<void>;
  resetTable: () => void;

  // URL sync
  updateUrl: () => void;
}

export function useTable<T>({
  tableKey,
  dataFetcher,
  autoFetch = true,
  syncUrl = true,
}: UseTableOptions<T>): UseTableReturn<T> {
  const config = TABLE_REGISTRY[tableKey];
  const {
    initTable,
    setTableParams,
    resetTable: resetTableStore,
  } = useDatatableStore();
  const tableState = useDatatableStore((s) => selectTableState(s, config.key));

  // Local state
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    total_records: 0,
    page_size: 10,
    current_page: 1,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL management
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize table state from URL params
  useEffect(() => {
    if (!syncUrl) return;

    const params = new URLSearchParams(searchParams);

    // Parse URL params
    const page = Math.max(
      1,
      parseInt(params.get("page[offset]") || "0") /
        parseInt(params.get("page[limit]") || String(config.defaultPageSize)) +
        1
    );
    const pageSize = parseInt(
      params.get("page[limit]") || String(config.defaultPageSize)
    );
    const sort = params.get("sort")?.replace("-", "");
    const order = params.get("sort")?.startsWith("-") ? "desc" : "asc";

    // Parse filters from URL
    const filters = parseBrowserUrlToFilters(params, config.fieldTypes);

    // Initialize table state
    initTable({
      key: config.key,
      initial: {
        page,
        page_size: pageSize,
        sort: sort || undefined,
        order: order as "asc" | "desc" | undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      },
    });
  }, [searchParams, initTable, config, syncUrl]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!autoFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await dataFetcher({
        page: tableState.page,
        page_size: tableState.page_size,
        sort: tableState.sort,
        order: tableState.order,
        filters: tableState.filters,
      });

      setData(result.items);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error(`Error fetching ${tableKey} data:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [
    autoFetch,
    dataFetcher,
    tableState.page,
    tableState.page_size,
    tableState.sort,
    tableState.order,
    tableState.filters,
    tableKey,
  ]);

  // Auto-fetch data when table state changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update URL when table state changes
  const updateUrl = useCallback(() => {
    if (!syncUrl) return;

    const params = new URLSearchParams();

    // Add pagination
    if (tableState.page_size !== config.defaultPageSize) {
      params.set("page[limit]", String(tableState.page_size));
    }
    if (tableState.page > 1) {
      const offset = (tableState.page - 1) * tableState.page_size;
      params.set("page[offset]", String(offset));
    }

    // Add sorting
    if (tableState.sort) {
      const sortVal =
        tableState.order === "desc" ? `-${tableState.sort}` : tableState.sort;
      params.set("sort", sortVal);
    }

    // Add filters
    if (tableState.filters) {
      Object.entries(tableState.filters).forEach(([field, filter]) => {
        if (!filter) return;

        if (filter.operator === "daterange") {
          const dateFilter = filter as DateRangeFilter;
          if (dateFilter.from)
            params.set(`filter[${field}_from]`, dateFilter.from);
          if (dateFilter.to) params.set(`filter[${field}_to]`, dateFilter.to);
        } else {
          if (filter.value !== undefined && filter.value !== "") {
            params.set(`filter[${field}]`, String(filter.value));
          }
        }
      });
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [tableState, config, syncUrl, pathname, router]);

  // Sync URL when table state changes
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Record<string, any>) => {
      const filters = modalFormatToFilters(newFilters, config.fieldTypes);
      setTableParams({
        key: config.key,
        params: { page: 1, filters },
      });
    },
    [config, setTableParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setTableParams({
        key: config.key,
        params: { page },
      });
    },
    [config, setTableParams]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setTableParams({
        key: config.key,
        params: { page_size: pageSize, page: 1 },
      });
    },
    [config, setTableParams]
  );

  const handleSortChange = useCallback(
    (sort: string, order: "asc" | "desc") => {
      setTableParams({
        key: config.key,
        params: { sort, order, page: 1 },
      });
    },
    [config, setTableParams]
  );

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const resetTable = useCallback(() => {
    resetTableStore(config.key);
  }, [resetTableStore, config.key]);

  return {
    // Data
    data,
    pagination,
    isLoading,
    error,

    // State
    tableState,
    config,

    // Actions
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    refreshData,
    resetTable,

    // URL sync
    updateUrl,
  };
}
