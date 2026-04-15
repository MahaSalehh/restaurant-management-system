import { Row, Col, Pagination } from "react-bootstrap";

const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
        );

    return (
        <Row className="mt-4" style={{ color: "var(--primary-color)" }}>
            <Col className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.First
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    />

                    <Pagination.Prev
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    />

                    {pages.map((page) => (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() =>
                            onPageChange(Math.min(currentPage + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    />

                    <Pagination.Last
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </Col>
        </Row>
    );
};

export default PaginationComponent;
