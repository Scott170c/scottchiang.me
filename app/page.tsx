const deployChecks = [
  "Next.js App Router is rendering",
  "Styles are loading",
  "Vercel can build this repo",
];

export default function Home() {
  return (
    <main className="page">
      <section className="panel" aria-labelledby="page-title">
        <p className="eyebrow">Deployment check</p>
        <h1 id="page-title">scottchiang.me is live-ready.</h1>
        <p className="intro">
          If you can see this page locally or on Vercel, the basic Next.js
          setup is working.
        </p>
        <ul className="checks" aria-label="Deployment checks">
          {deployChecks.map((check) => (
            <li key={check}>
              <span aria-hidden="true">✓</span>
              {check}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
