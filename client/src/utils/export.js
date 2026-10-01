function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function downloadCsv(filename, headers, rows) {
  const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printTableAsPdf(title, headers, rows) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.alert("Allow pop-ups to print or save this report as a PDF.");
    return;
  }

  const tableRows = rows.map((row) =>
    `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
  ).join("");
  printWindow.document.write(`<!doctype html>
    <html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
    <style>
      body{font:12px Arial,sans-serif;color:#172126;margin:32px}
      h1{color:#00647c;font-size:22px;margin:0 0 6px}
      p{color:#526168;margin:0 0 20px}
      table{width:100%;border-collapse:collapse}
      th,td{padding:9px 10px;border:1px solid #cbd5da;text-align:left;vertical-align:top}
      th{background:#eaf4f6;color:#064e5e}
      tr:nth-child(even){background:#f7fafb}
      @media print{body{margin:16mm}thead{display:table-header-group}}
    </style></head><body>
    <h1>${escapeHtml(title)}</h1>
    <p>Generated ${escapeHtml(new Date().toLocaleString())}</p>
    <table><thead><tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
    <tbody>${tableRows || `<tr><td colspan="${headers.length}">No records to display.</td></tr>`}</tbody></table>
    <script>window.onload=()=>window.print();</script>
    </body></html>`);
  printWindow.document.close();
}
