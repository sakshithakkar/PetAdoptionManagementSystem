const Pagination = ({ page, setPage, hasMore = true }) => {
  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">

        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
        </li>

        <li className="page-item active">
          <span className="page-link">Page {page}</span>
        </li>

        <li className={`page-item ${!hasMore ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </li>

      </ul>
    </nav>
  );
};

export default Pagination;
