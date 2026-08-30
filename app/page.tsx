import { getDashboard } from "../src/dashboard";
export default async function Page() {
  const data = await getDashboard("org_a");
  return (
    <main className="shell">
      <h1>AcmeOps Dashboard</h1>
      <p>Mock SaaS dashboard for Autter review demos.</p>
      <section className="grid">
        {data.projects.map((p) => (
          <article className="card" key={p.id}>
            <h2>{p.name}</h2>
            <p>Usage: {p.usage}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
