import Image from "next/image";
import type { ComplectationRow } from "@/content/materials";

export function ComplectationTable({ rows }: { rows: ComplectationRow[] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-left">
            <th className="w-20 p-4 font-normal text-stone" />
            <th className="p-4 font-normal text-xs uppercase tracking-[0.15em] text-stone">
              Позиция
            </th>
            <th className="p-4 font-normal text-xs uppercase tracking-[0.15em] text-stone">
              Бренд / характеристики
            </th>
            <th className="p-4 font-normal text-xs uppercase tracking-[0.15em] text-stone">
              Цена
            </th>
            <th className="p-4 font-normal text-xs uppercase tracking-[0.15em] text-stone">
              Срок поставки
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug} className="border-b border-line last:border-b-0">
              <td className="p-4">
                <div className="relative h-14 w-14 overflow-hidden bg-surface">
                  <Image src={row.photo} alt={row.name} fill sizes="56px" className="object-cover" />
                </div>
              </td>
              <td className="p-4 text-ink">{row.name}</td>
              <td className="p-4 text-stone">
                <span className="text-ink">{row.brand}</span>
                <br />
                {row.specs}
              </td>
              <td className="p-4 text-ink">{row.price}</td>
              <td className="p-4 text-stone">{row.leadTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
