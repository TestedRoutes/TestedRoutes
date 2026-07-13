import NewsletterForm from "./NewsletterForm";

export default function ConstructionBanner() {
  return (
    <div
      style={{
        background: "#1f0d07",
        color: "#f4f3ef",
        padding: "10px 16px",
        fontFamily: "sans-serif",
        letterSpacing: "0.03em",
      }}
      className="flex items-center justify-center"
    >
      <NewsletterForm
        variant="compact"
        source="top-banner"
        headline="Launching August 2026 – get notified:"
      />
    </div>
  );
}
