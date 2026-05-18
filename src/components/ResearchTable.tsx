interface TableRow {
  cells: string[];
}

interface ResearchTableProps {
  caption?: string;
  headers: string[];
  rows: TableRow[];
}

export function ResearchTable({ caption, headers, rows }: ResearchTableProps) {
  return (
    <figure className="my-12">
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/60 font-medium border-r border-white/10 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-white/80 font-light border-r border-white/10 last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-white/40 font-mono text-[10px] uppercase tracking-widest">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
