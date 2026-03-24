import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import type {
    Column,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';
import type { Participant } from '@/types/types';
import { fetchParticipants } from '@/api/participant';

export const Route = createFileRoute('/admin/participants')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data, isPending } = useQuery<Array<Participant>>({
        queryKey: ['participants'],
        queryFn: fetchParticipants,
    });

    const columnHelper = createColumnHelper<Participant>();

    const columns = [
        columnHelper.accessor('user.name', {
            id: 'name',
            header: 'Name',
            cell: (info) => info.getValue(),
            filterFn: 'includesString',
        }),
        columnHelper.accessor('user.email', {
            id: 'email',
            header: 'Email',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('team.name', {
            id: 'teamName',
            header: 'Team',
            cell: (info) => info.getValue() || 'No Team',
            filterFn: 'includesString',
        }),
        columnHelper.accessor('role', {
            id: 'role',
            header: 'Role',
            cell: (info) => info.getValue(),
            filterFn: 'arrIncludes',
        }),
        columnHelper.accessor('status', {
            id: 'status',
            header: 'Status',
            cell: (info) => info.getValue(),
            filterFn: 'arrIncludes',
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button onClick={() => console.log('Edit:', row.original)}>
                    Edit
                </button>
            ),
        }),
    ];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        columns,
        data: data ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        debugRows: true,
    });

    const roleFacets = table.getColumn('role')?.getFacetedUniqueValues();
    const statusFacets = table.getColumn('status')?.getFacetedUniqueValues();

    console.log('Role facets:', roleFacets, 'Status facets:', statusFacets);
    if (isPending || !data) return <div>Loading...</div>;

    return (
        <main className="p-6">
            <h1 className="title-gradient bg-clip-text text-transparent font-bold uppercase text-7xl font-title">
                Participants
            </h1>
            <div className="flex gap-3 w-full flex-row-reverse items-center">
                <div className="flex gap-4 mb-4">
                    <input
                        value={
                            table.getColumn('name')?.getFilterValue() as string
                        }
                        onChange={(e) =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(e.target.value)
                        }
                        placeholder="Search name..."
                        className="border p-2 rounded"
                    />
                    <input
                        value={
                            table
                                .getColumn('teamName')
                                ?.getFilterValue() as string
                        }
                        onChange={(e) =>
                            table
                                .getColumn('teamName')
                                ?.setFilterValue(e.target.value)
                        }
                        placeholder="Search team..."
                        className="border p-2 rounded"
                    />
                </div>
                {roleFacets && (
                    <FilterCheckboxes
                        column={table.getColumn('role')}
                        facets={roleFacets}
                    />
                )}
                {statusFacets && (
                    <FilterCheckboxes
                        column={table.getColumn('status')}
                        facets={statusFacets}
                    />
                )}
            </div>
            <main className="p-6">
                <table className="w-full mt-6 border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border p-2 text-left cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                        {header.column.getIsSorted() ===
                                            'asc' && ' ↑'}
                                        {header.column.getIsSorted() ===
                                            'desc' && ' ↓'}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="border p-2">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </main>
    );
}

function FilterCheckboxes({
    column,
    facets,
}: {
    column: Column<any, unknown> | undefined;
    facets: Map<string, number> | undefined;
}) {
    if (!column || !facets) return null;
    const filterValue = (column.getFilterValue() ?? []) as Array<string>;

    const toggleValue = (value: string) => {
        const newValue = filterValue.includes(value)
            ? filterValue.filter((v) => v !== value)
            : [...filterValue, value];
        console.log(`Setting filter for ${column.id}:`, newValue);
        column.setFilterValue(newValue.length ? newValue : undefined);
    };

    return (
        <div className="space-y-2">
            {Array.from(facets.entries()).map(([value, count]) => (
                <label key={value} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filterValue.includes(value)}
                        onChange={() => toggleValue(value)}
                    />
                    <span>
                        {value} ({count})
                    </span>
                </label>
            ))}
        </div>
    );
}
