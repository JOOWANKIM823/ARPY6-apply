import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("receipt_no", { ascending: true });

    if (error) throw error;

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("접수순");

    ws.columns = [
      { header: "접수순번", key: "receipt_no", width: 10 },
      { header: "분야", key: "field", width: 12 },
      { header: "이름", key: "name", width: 12 },
      { header: "생년월일", key: "birth_date", width: 14 },
      { header: "회사명", key: "company_name", width: 20 },
      { header: "직위", key: "position", width: 12 },
      { header: "나이", key: "age", width: 10 },
      { header: "성별", key: "gender", width: 10 },
      { header: "가족관계", key: "family_relation", width: 22 },
      { header: "추천인", key: "recommender", width: 22 },
      { header: "학력", key: "education", width: 28 },
      { header: "경력", key: "career", width: 28 },
      { header: "사업자등록번호", key: "business_number", width: 18 },
      { header: "3개년 매출 합계", key: "revenue_total", width: 18 },
      { header: "25년도", key: "revenue_2025", width: 16 },
      { header: "24년도", key: "revenue_2024", width: 16 },
      { header: "23년도", key: "revenue_2023", width: 16 }
    ];

    (data || []).forEach((row) => ws.addRow(row));

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename*=UTF-8''ARPY6-export.xlsx"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "엑셀 생성 실패" }, { status: 500 });
  }
}
