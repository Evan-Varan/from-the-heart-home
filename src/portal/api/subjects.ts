import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/portal/lib/db.server";
import { subjects } from "@/portal/db/schema";

export interface SubjectOption {
  id: string;
  name: string;
  category: string | null;
}

export const getSubjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<SubjectOption[]> => {
    const db = getDb();
    return db
      .select({ id: subjects.id, name: subjects.name, category: subjects.category })
      .from(subjects)
      .where(eq(subjects.active, 1))
      .orderBy(subjects.category, subjects.name);
  },
);
