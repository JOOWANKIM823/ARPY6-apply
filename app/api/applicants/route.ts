import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplicantInsert = {
  receipt_no: number;
  field: string;
  name: string;
  birth_date: string;
  company_name: string;
  position: string;
  age: number | null;
  gender: string;
  family_relation: string;
  recommender: string;
  education: string;
  career: string;
  business_number: string;
  revenue_total: number | null;
  revenue_2025: number | null;
  revenue_2024: number | null;
  revenue_2023: number | null;
};

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("receipt_no", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ rows: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const formData = await request.formData();
    const files = formData.getAll("zipFiles").filter((item) => typeof item !== "string") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "ZIP 파일이 없습니다." }, { status: 400 });
    }

    const { count, error: countError } = await supabase
      .from("applicants")
      .select("*", { head: true, count: "exact" });

    if (countError) throw countError;

    const rows: ApplicantInsert[] = files.map((file, index) => ({
      receipt_no: (count || 0) + index + 1,
      field: "",
      name: file.name.replace(/\.zip$/i, ""),
      birth_date: "",
      company_name: "",
      position: "",
      age: null,
      gender: "",
      family_relation: "",
      recommender: "",
      education: "",
      career: "",
      business_number: "",
      revenue_total: null,
      revenue_2025: null,
      revenue_2024: null,
      revenue_2023: null
    }));

    const { data, error } = await supabase
      .from("applicants")
      .insert(rows)
      .select("*")
      .order("receipt_no", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ rows: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "업로드 실패" }, { status: 500 });
  }
}
