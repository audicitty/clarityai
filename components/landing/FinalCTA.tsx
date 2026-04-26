"use client";

export function FinalCTA() {
  const scrollToDemo = () => {
    document.getElementById("demo-live")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="fcta">
      <div className="fcta-bg">GO</div>
      <div className="fcta-eye">// Your move</div>
      <div className="fcta-title">
        YOUR NEXT MEETING<br />NOTES DESERVE<br /><em>THIS.</em>
      </div>
      <button className="btn-fcta" onClick={scrollToDemo}>
        Start clarifying →
      </button>
    </section>
  );
}
