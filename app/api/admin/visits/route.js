import { NextResponse } from "next/server";

import { getAdminSession } from "../../../../lib/auth";

import { getServiceClient } from "../../../../lib/supabase";

async function auth() {
  const session = await getAdminSession();

  if (!session) return null;

  return getServiceClient();
}

export async function GET() {
  const supabase = await auth();

  if (!supabase) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const today =
    new Date().toISOString().split("T")[0];

  const yesterdayDate = new Date();

  yesterdayDate.setDate(
    yesterdayDate.getDate() - 1
  );

  const yesterday =
    yesterdayDate.toISOString().split("T")[0];

  const { count: todayUnique } =
    await supabase
      .from("page_visits")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("visit_date", today);

  const { count: yesterdayUnique } =
    await supabase
      .from("page_visits")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("visit_date", yesterday);

  const { count: totalHits } =
    await supabase
      .from("page_visits")
      .select("*", {
        count: "exact",
        head: true,
      });

  const { data: daily } =
    await supabase
      .from("page_visits")
      .select("visit_date");

  const dailyMap = {};

  daily?.forEach((v) => {
    dailyMap[v.visit_date] =
      (dailyMap[v.visit_date] || 0) + 1;
  });

  const dailyStats =
    Object.entries(dailyMap)
      .map(([date, unique]) => ({
        date,
        unique,
        label: new Date(date)
          .toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
            }
          ),
      }))
      .sort((a, b) =>
        a.date.localeCompare(b.date)
      );

  return NextResponse.json({
    todayUnique: todayUnique || 0,
    yesterdayUnique:
      yesterdayUnique || 0,

    totalHits: totalHits || 0,

    last30Unique:
      dailyStats.reduce(
        (s, d) => s + d.unique,
        0
      ),

    daily: dailyStats.slice(-30),

    topPages: [],
  });
}