"use client";

import { useEffect, useState } from "react";

type ApplicantRow = {
  id?: string;
  receipt_no: number;
  field: string | null;
  name: string | null;
  birth_date: string | null;
  company_name: string | null;
  position: string | null;
  age: number | null;
  gender: string | null;
  family_relation: string | null;
  recommender: string | null;
  education: string | null;
  career: string | null;
  business_number: string | null;
  revenue_total: number | null;
  revenue_2025: number | null;
  revenue_2024: number | null;
  revenue_2023: number | null;
  created_at?: string | null;
};

export default function Page() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [rows, setRows] = useState<ApplicantRow[]>([]);
  const [message, setMessage] = useState("");

  async function fetchRows() {
    const res = await fetch("/api/applicants", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setRows(json.rows || []);
    else setMessage(json.error || "목록 조회 실패");
  }

  useEffect(() => {
    fetchRows();
  }, []);

  async function upload() {
    if (!files || files.length === 0) {
      setMessage("ZIP 파일을 선택하세요.");
      return;
    }

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("zipFiles", f));

    const res = await fetch("/api/applicants", {
      method: "POST",
      body: fd
    });

    const json = await res.json();

    if (!res.ok) {
      setMessage(json.error || "업로드 실패");
      return;
    }

    setMessage(`${files.length}건 업로드 완료`);
    setFiles(null);
    await fetchRows();
  }

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <section style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>ARPY6 업로드 테스트</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".zip"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button onClick={upload}>업로드</button>
          <a href="/api/export">엑셀 다운로드</a>
        </div>
        {message ? <p style={{ color: "#1d4ed8" }}>{message}</p> : null}
      </section>

      <section style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: 24, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>저장된 데이터</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: 1500, width: "100%" }}>
            <thead>
              <tr>
                {["접수순번","분야","이름","생년월일","회사명","직위","나이","성별","가족관계","추천인","학력","경력","사업자등록번호","합계","25","24","23"].map((h) => (
                  <th key={h} style={{ border: "1px solid #ddd", background: "#eef4ff", padding: 8, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((row, i) => (
                <tr key={row.id || i}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.receipt_no ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.field ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.name ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.birth_date ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.company_name ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.position ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.age ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.gender ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.family_relation ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.recommender ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8, whiteSpace: "pre-wrap" }}>{row.education ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8, whiteSpace: "pre-wrap" }}>{row.career ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.business_number ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.revenue_total ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.revenue_2025 ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.revenue_2024 ?? ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.revenue_2023 ?? ""}</td>
                </tr>
              )) : (
                <tr><td colSpan={17} style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>데이터 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
