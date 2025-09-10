import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface PaginationMeta {
    current_page: number;
    total_pages: number;
    page_size: number;
    total_records: number;
}

interface BottomContentProps {
    paginationMeta: PaginationMeta;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export default function BottomContent({ 
    paginationMeta, 
    onPageChange, 
    onPageSizeChange 
}: BottomContentProps) {

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const handlePageSizeChange = (size: number) => {
        console.log('Page size changed to:', size);
        if (onPageSizeChange) {
            onPageSizeChange(size);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const current = paginationMeta.current_page;
        const total = paginationMeta.total_pages;
        
        // Always show first page
        pages.push(1);
        
        if (current > 4) {
            pages.push('ellipsis-start');
        }
        
        // Show pages around current page
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            if (i !== 1 && i !== total) {
                pages.push(i);
            }
        }
        
        if (current < total - 3) {
            pages.push('ellipsis-end');
        }
        
        // Always show last page if there's more than one page
        if (total > 1) {
            pages.push(total);
        }
        
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={paginationMeta.page_size.toString()}
                    onValueChange={(value) => {
                        console.log('Select onValueChange:', value);
                        handlePageSizeChange(parseInt(value));
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={paginationMeta.page_size.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {paginationMeta.current_page} of {paginationMeta.total_pages}
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(paginationMeta.current_page - 1)}
                                className={paginationMeta.current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        
                        {pageNumbers.map((page, index) => (
                            <PaginationItem key={index}>
                                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => handlePageChange(page as number)}
                                        isActive={page === paginationMeta.current_page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => handlePageChange(paginationMeta.current_page + 1)}
                                className={paginationMeta.current_page >= paginationMeta.total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
