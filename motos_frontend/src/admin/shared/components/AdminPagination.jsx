const DEFAULT_PAGE_SIZE = 10;
const PAGE_WINDOW_SIZE = 5;

export function paginateItems(items, requestedPage = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const totalItems = Array.isArray(items) ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const visibleItems = (items || []).slice(startIndex, endIndex);

  return {
    items: visibleItems,
    totalItems,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    pageSize,
  };
}

function buildVisiblePages(currentPage, totalPages) {
  if (totalPages <= PAGE_WINDOW_SIZE) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
  let start = currentPage - halfWindow;
  let end = currentPage + halfWindow;

  if (start < 1) {
    start = 1;
    end = PAGE_WINDOW_SIZE;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - PAGE_WINDOW_SIZE + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function AdminPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalItems <= 0) return null;

  const { currentPage, totalPages } = pagination;
  const visiblePages = buildVisiblePages(currentPage, totalPages);

  return (
    <div className="admin-pagination" role="navigation" aria-label="Paginacion de tabla">
      {totalPages > 1 && (
        <div className="admin-pagination-controls">
          <button
            type="button"
            className="admin-page-btn ghost"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Primera pagina"
          >
            {"<<"}
          </button>

          <button
            type="button"
            className="admin-page-btn ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Pagina anterior"
          >
            Anterior
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              className={page === currentPage ? "admin-page-btn active" : "admin-page-btn ghost"}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="admin-page-btn ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Pagina siguiente"
          >
            Siguiente
          </button>

          <button
            type="button"
            className="admin-page-btn ghost"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Ultima pagina"
          >
            {">>"}
          </button>
        </div>
      )}
    </div>
  );
}
