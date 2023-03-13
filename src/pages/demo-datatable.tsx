import {
    Column,
    Table,
    createColumnHelper,
    useReactTable,
    flexRender,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { useContext, useEffect, useMemo, useState } from "react";
import { MediaInfoContext } from "../contexts/MediaInfo";
import { objectToProduct, Product } from "../models/Product";
import "./demo-datatable.css";

const columnHelper = createColumnHelper<Product>();

const DemoDataTable = () => {
    const mediaInfo = useContext(MediaInfoContext);

    const [products, setProducts] = useState<Product[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = [
        columnHelper.display({
            id: "index",
            header: () => <b>#</b>,
            cell: (info) => info.row.index,
        }),
        columnHelper.accessor("title", {
            header: () => <b>Title</b>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("category.name", {
            header: () => <b>Category</b>,
            cell: (info) => info.getValue().toUpperCase(),
            enableSorting: true,
            sortingFn: (a, b) => (a.original.category.name > b.original.category.name ? -1 : 1),
        }),
        columnHelper.accessor("createdBy.name", {
            header: () => <b>Created By</b>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("createdAt", {
            header: () => <b>Created At</b>,
            cell: (info) => {
                return new Date(info.getValue()).toLocaleDateString();
            },
        }),
        columnHelper.accessor("price", {
            header: () => <b>Price</b>,
            cell: (info) => `$ ${info.getValue()}`,
        }),
        columnHelper.accessor("description", {
            header: () => <b>Description</b>,
            cell: (info) => (info.getValue() ? info.getValue() : "No description."),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: (props) => <button onClick={() => console.log(props.row.original)}>Edit</button>,
        }),
    ];

    useEffect(() => {
        fetch("https://api.storerestapi.com/products")
            .then((response) => response.json())
            .then((json) => {
                if (json.data?.length) {
                    const data = json.data.map((product: string) => objectToProduct(product));

                    setProducts(data);
                }
            });
    }, []);

    const tableInstance = useReactTable<Product>({
        columns,
        data: products,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    const { getHeaderGroups, getRowModel } = tableInstance;

    return (
        <>
            {(mediaInfo.isDesktop || mediaInfo.isTablet) && (
                <div>
                    <table>
                        <thead>
                            {getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? "cursor-pointer select-none"
                                                        : "",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: "🔼",
                                                    desc: "🔽",
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={tableInstance} />
                                                </div>
                                            ) : null}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => tableInstance.setPageIndex(0)}
                            disabled={!tableInstance.getCanPreviousPage()}
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => tableInstance.previousPage()}
                            disabled={!tableInstance.getCanPreviousPage()}
                        >
                            {"<"}
                        </button>
                        <button onClick={() => tableInstance.nextPage()} disabled={!tableInstance.getCanNextPage()}>
                            {">"}
                        </button>
                        <button
                            onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
                            disabled={!tableInstance.getCanNextPage()}
                        >
                            {">>"}
                        </button>
                        <span>
                            <div>Page</div>
                            <strong>
                                {tableInstance.getState().pagination.pageIndex + 1} of {tableInstance.getPageCount()}
                            </strong>
                        </span>
                        <span>
                            | Go to page:
                            <input
                                type="number"
                                defaultValue={tableInstance.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    tableInstance.setPageIndex(page);
                                }}
                            />
                        </span>
                        <select
                            value={tableInstance.getState().pagination.pageSize}
                            onChange={(e) => {
                                tableInstance.setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {mediaInfo.isMobile && (
                <div className="products-list">
                    {products.map((product) => (
                        <div className="product-card" key={product._id}>
                            <div>Title: {product.title}</div>
                            <div>Category: {product.category.name}</div>
                            <div>Created by{product.createdBy.name}</div>
                            <div>Created at:{new Date(product.createdAt).toLocaleDateString()}</div>
                            <div>Price: {product.price}</div>
                            <div>Description: {product.description ? product.description : "None."}</div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = useMemo(
        () => (typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
        [column.getFacetedUniqueValues()]
    );

    return typeof firstValue === "number" ? (
        <div>
            <div>
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
                    value={(columnFilterValue as [number, number])?.[0] ?? ""}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
                    placeholder={`Min ${
                        column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ""
                    }`}
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
                    value={(columnFilterValue as [number, number])?.[1] ?? ""}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
                    placeholder={`Max ${
                        column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ""
                    }`}
                />
            </div>
        </div>
    ) : (
        <>
            <datalist id={column.id + "list"}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? "") as string}
                onChange={(value) => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                list={column.id + "list"}
            />
        </>
    );
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export default DemoDataTable;
