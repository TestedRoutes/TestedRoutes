import NewsletterForm from "./NewsletterForm";

export default function ConstructionBanner() {
  return (
    <div
      style={{
        background: "#1a1816",
        color: "#f7f4ef",
        padding: "10px 16px",
        fontFamily: "sans-serif",
        letterSpacing: "0.03em",
      }}
      className="flex items-center justify-center"
    >
      <NewsletterForm
        variant="compact"
        source="top-banner"
        headline="Launching June 2026 — get notified:"
      />
    </div>
  );
}
