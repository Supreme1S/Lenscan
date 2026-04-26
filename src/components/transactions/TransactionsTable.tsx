import { Badge } from "@/components/ui/Badge";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import type { TransactionRow } from "@/lib/types/portfolio";

const statusTone = {
  success: "success" as const,
  pending: "warning" as const,
  failed: "danger" as const,
};

export function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Time</Th>
          <Th>Type</Th>
          <Th>Summary</Th>
          <Th>Digest</Th>
          <Th>Status</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.map((r) => (
          <Tr key={r.id}>
            <Td className="whitespace-nowrap text-zinc-500">{r.timestamp}</Td>
            <Td className="capitalize">{r.kind}</Td>
            <Td>{r.summary}</Td>
            <Td className="font-mono text-xs text-zinc-500">{r.digest}</Td>
            <Td>
              <Badge tone={statusTone[r.status]}>{r.status}</Badge>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
}
