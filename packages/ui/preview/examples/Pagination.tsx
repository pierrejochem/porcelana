import { useState } from "react";
import { Pagination } from "@porcelana/ui";

export default function Example() {
  const [page, setPage] = useState(5);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}
