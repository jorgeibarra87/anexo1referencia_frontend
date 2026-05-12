const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = 5;

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
  let end = Math.min(start + visiblePages, totalPages);

  if (end - start < visiblePages) {
    start = Math.max(0, end - visiblePages);
  }

  const pages = [];
  for (let i = start; i < end; i++) {
    pages.push(
      <button key={i} onClick={() => goToPage(i)}
        className={`mx-1 px-3 py-1 rounded border text-sm font-medium transition ${i === currentPage ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`} >
        {i + 1}
      </button>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-sm">
      <button onClick={() => goToPage(0)} disabled={currentPage === 0} 
      className="px-2 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50" >
        ⏮
      </button>
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} 
      className="px-2 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50" >
        ⬅️
      </button>
      {pages}
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage + 1 >= totalPages}
        className="px-2 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50" >
        ➡️
      </button>
      <button
        onClick={() => goToPage(totalPages - 1)} disabled={currentPage + 1 >= totalPages}
        className="px-2 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
        ⏭
      </button>
    </div>
  );
};

export default Pagination;
