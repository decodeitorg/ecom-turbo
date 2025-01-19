import React, { useState } from "react";

const Pagination = ({ currentPage, totalPages, itemsPerPage, chagnePage }) => {
    let [page, setPage] = useState(currentPage);
    return (
        <nav class=" d-flex justify-content-center align-items-start ">
            <div>
                <ul className="pagination justify-content-center   align-items-center">
                    <li
                        className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() =>
                                chagnePage({ page: currentPage - 1 })
                            }
                        >
                            Previous
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li
                            className={`page-item ${
                                currentPage === i + 1 ? "active" : ""
                            }`}
                            key={i}
                        >
                            <button
                                className="page-link"
                                onClick={() => chagnePage({ page: i + 1 })}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() =>
                                chagnePage({ page: currentPage + 1 })
                            }
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </div>

            {/* limit select */}
            <div className="px-2">
                <select
                    className="form-select"
                    aria-label="Default select example"
                    value={itemsPerPage}
                    onChange={(e) =>
                        chagnePage({ limit: Number(e.target.value) })
                    }
                >
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
            <p className="text-nowrap px-2 mt-2">Go to page</p>
            <div className="d-flex align-items-center">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        chagnePage({ page: e.target.page.value });
                    }}
                >
                    <input
                        type="number"
                        name="page"
                        className="form-control"
                        value={page}
                        max={totalPages}
                        min={1}
                        onChange={(e) => setPage(e.target.value)}
                    />
                </form>
            </div>
        </nav>
    );
};

export default Pagination;
