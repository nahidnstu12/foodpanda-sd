// import type { FilterValue, DateRangeFilter, FilterFieldType } from '@/store/features/datatableSlice';

import { CustomColumnDef } from "@/components/datatable/type";
import { DateRangeFilter, FilterFieldType, FilterValue } from "./datatable.type";

// Utility functions for filter URL generation and parsing

/**
 * Generate browser URL parameters from filter state
 * Format: filter[field]=value (clean format for browser URLs)
 */
export function generateBrowserUrlParams(filters: Record<string, FilterValue | DateRangeFilter>): URLSearchParams {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([field, filter]) => {
    if (!filter) return;
    
    if (filter.operator === 'daterange') {
      const dateFilter = filter as DateRangeFilter;
      if (dateFilter.from) {
        params.append(`filter[${field}_from]`, dateFilter.from);
      }
      if (dateFilter.to) {
        params.append(`filter[${field}_to]`, dateFilter.to);
      }
    } else {
      const simpleFilter = filter as FilterValue;
      if (simpleFilter.value !== undefined && simpleFilter.value !== '') {
        params.append(`filter[${field}]`, String(simpleFilter.value));
      }
    }
  });
  
  return params;
}

/**
 * Generate API URL parameters from filter state
 * Format: filter[field]=*value* or filter[field]==value (with operators)
 */
export function generateApiUrlParams(filters: Record<string, FilterValue | DateRangeFilter>): URLSearchParams {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([field, filter]) => {
    if (!filter) return;
    
    if (filter.operator === 'daterange') {
      const dateFilter = filter as DateRangeFilter;
      if (dateFilter.from) {
        params.append(`filter[${field}]`, `>=${dateFilter.from}`);
      }
      if (dateFilter.to) {
        params.append(`filter[${field}]`, `<=${dateFilter.to}`);
      }
    } else {
      const simpleFilter = filter as FilterValue;
      if (simpleFilter.value !== undefined && simpleFilter.value !== '') {
        let apiValue: string;
        
        switch (simpleFilter.operator) {
          case 'input':
            apiValue = `*${simpleFilter.value}*`;
            break;
          case 'select':
            apiValue = `=${simpleFilter.value}`;
            break;
          case 'date':
            apiValue = `=${simpleFilter.value}`;
            break;
          default:
            apiValue = String(simpleFilter.value);
            break;
        }
        
        params.append(`filter[${field}]`, apiValue);
      }
    }
  });
  
  return params;
}

/**
 * Parse browser URL parameters into filter state
 * Converts clean URL format back to operator-based filter state
 */
export function parseBrowserUrlToFilters(
  searchParams: URLSearchParams,
  fieldTypeMap: Record<string, FilterFieldType>
): Record<string, FilterValue | DateRangeFilter> {
  const filters: Record<string, FilterValue | DateRangeFilter> = {};
  
  // Handle regular filter[field] parameters
  for (const [key, value] of searchParams.entries()) {
    const filterMatch = key.match(/^filter\[(.+)\]$/);
    if (filterMatch && value) {
      const field = filterMatch[1];
      const fieldType = fieldTypeMap[field];
      
      if (fieldType) {
        filters[field] = {
          operator: fieldType,
          value: value
        };
      }
    }
  }
  
  // Handle date range parameters (filter[field_from] and filter[field_to])
  const dateRangeFields: Record<string, { from?: string; to?: string }> = {};
  
  for (const [key, value] of searchParams.entries()) {
    const fromMatch = key.match(/^filter\[(.+)_from\]$/);
    const toMatch = key.match(/^filter\[(.+)_to\]$/);
    
    if (fromMatch && value) {
      const field = fromMatch[1];
      if (!dateRangeFields[field]) dateRangeFields[field] = {};
      dateRangeFields[field].from = value;
    }
    
    if (toMatch && value) {
      const field = toMatch[1];
      if (!dateRangeFields[field]) dateRangeFields[field] = {};
      dateRangeFields[field].to = value;
    }
  }
  
  // Convert date range fields to DateRangeFilter format
  Object.entries(dateRangeFields).forEach(([field, range]) => {
    if (range.from || range.to) {
      filters[field] = {
        operator: 'daterange',
        from: range.from,
        to: range.to
      } as DateRangeFilter;
    }
  });
  
  return filters;
}

/**
 * Convert filter state to format expected by filter modal
 * Flattens the operator-based structure for form inputs
 */
export function filtersToModalFormat(filters: Record<string, FilterValue | DateRangeFilter>): Record<string, any> {
  const modalFormat: Record<string, any> = {};
  
  Object.entries(filters).forEach(([field, filter]) => {
    if (!filter) return;
    
    if (filter.operator === 'daterange') {
      const dateFilter = filter as DateRangeFilter;
      modalFormat[field] = {
        from: dateFilter.from || '',
        to: dateFilter.to || ''
      };
    } else {
      const simpleFilter = filter as FilterValue;
      modalFormat[field] = simpleFilter.value || '';
    }
  });
  
  return modalFormat;
}

/**
 * Convert filter modal format back to filter state
 * Takes form inputs and creates operator-based filter structure
 */
export function modalFormatToFilters(
  modalData: Record<string, any>,
  fieldTypeMap: Record<string, FilterFieldType>
): Record<string, FilterValue | DateRangeFilter> {
  const filters: Record<string, FilterValue | DateRangeFilter> = {};
  
  Object.entries(modalData).forEach(([field, value]) => {
    const fieldType = fieldTypeMap[field];
    if (!fieldType || !value) return;
    
    if (fieldType === 'daterange') {
      // Handle date range objects
      if (typeof value === 'object' && ('from' in value || 'to' in value)) {
        if (value.from || value.to) {
          filters[field] = {
            operator: 'daterange',
            from: value.from || undefined,
            to: value.to || undefined
          } as DateRangeFilter;
        }
      }
    } else {
      // Handle simple values
      if (value !== '' && value !== null && value !== undefined) {
        filters[field] = {
          operator: fieldType,
          value: value
        };
      }
    }
  });
  
  return filters;
}

/**
 * Field type mapping for notices table
 * This should ideally come from column definitions
 */
export const NOTICES_FIELD_TYPE_MAP: Record<string, FilterFieldType> = {
  'title': 'input',
  'status': 'select', 
  'publish_date': 'date',
  'archive_date': 'daterange',
  'organization.name': 'select',
};

/**
 * Field type mapping for users table
 * This should ideally come from column definitions
 */
export const USERS_FIELD_TYPE_MAP: Record<string, FilterFieldType> = {
  'full_name': 'input',
  'username': 'input',
  'email': 'input',
  'user_type': 'select',
  'gender': 'select',
  'status': 'select',
  'email_verified': 'select',
  'organization.name': 'select',
};

/**
 * Field type mapping for applications table
 * This should ideally come from column definitions
 */
export const APPLICATIONS_FIELD_TYPE_MAP: Record<string, FilterFieldType> = {
  'full_name': 'input',
  'email': 'input',
  'gender': 'select',
  'institute_category': 'select',
  'institute_name': 'input',
  'class_roll_number': 'input',
  'section': 'input',
  'mobile_number': 'input',
  'present_address': 'input',
  'father_name': 'input',
  'mother_name': 'input',
  'status': 'select',
  'organization.name': 'select',
  'institution.title': 'select',
  'user.full_name': 'input',
};

/**
 * Field type mapping for sliders table
 * This should ideally come from column definitions
 */
export const SLIDERS_FIELD_TYPE_MAP: Record<string, FilterFieldType> = {
  'title': 'input',
  'body': 'input',
  'publish_date': 'date',
  'archive_date': 'daterange',
  'status': 'select',
  'organization.name': 'select',
};

/**
 * Field type mapping for static contents table
 * This should ideally come from column definitions
 */
export const STATIC_CONTENTS_FIELD_TYPE_MAP: Record<string, FilterFieldType> = {
  'title': 'input',
  'code': 'input',
  'body': 'input',
  'status': 'select',
  'organization.name': 'select',
};

/**
 * Auto-generate field type map from column definitions
 */
export function generateFieldTypeMap<T>(
  columns: CustomColumnDef<T>[]
): Record<string, FilterFieldType> {
  return columns
    .filter(col => col.enableColumnFilter && col.filterField && col.accessorKey)
    .reduce((acc, col) => {
      const fieldKey = String(col.accessorKey);
      const filterType = col.filterField as FilterFieldType;
      
      // Handle special cases
      if (filterType === 'daterange') {
        acc[fieldKey] = 'daterange';
      } else if (filterType === 'date') {
        acc[fieldKey] = 'date';
      } else if (filterType === 'select') {
        acc[fieldKey] = 'select';
      } else {
        acc[fieldKey] = 'input';
      }
      
      return acc;
    }, {} as Record<string, FilterFieldType>);
}

/**
 * Generate complete table config from columns
 */
export function generateTableConfig<T>(
  tableKey: string,
  columns: CustomColumnDef<T>[],
  defaultPageSize: number = 10
) {
  return {
    key: tableKey,
    fieldTypes: generateFieldTypeMap(columns),
    defaultPageSize,
    columns
  };
}