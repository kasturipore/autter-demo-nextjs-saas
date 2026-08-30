import { NextResponse } from "next/server";
import { getProjectForUser } from "../../../../src/projects";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const project = getProjectForUser({ orgId: "org_a" }, (await params).id);
    if (!project)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: String(error), stack: (error as Error).stack },
      { status: 500 },
    );
  }
}
