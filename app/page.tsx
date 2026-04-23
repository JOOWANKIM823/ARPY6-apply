"use client";

import { useState } from "react";

export default function Page() {
  const [files, setFiles] = useState<FileList | null>(null);

  async function upload() {
    const fd = new FormData();
    Array.from(files || []).forEach(f => fd.append("zipFiles", f));

    await fetch("/api/applicants", {
      method: "POST",
      body: fd
    });

    alert("완료");
  }

  return (
    <div style={{ padding: 40 }}>
      <input
        type="file"
        multiple
        onChange={e => setFiles(e.target.files)}
      />
      <button onClick={upload}>업로드</button>
      <a href="/api/export">엑셀 다운로드</a>
    </div>
  );
}
