"use client";

import { useEffect, useRef, useState } from "react";

// Records the rating carried in the email's star link, then offers
// adjustment and an optional comment. The mount-time auto-submit is the
// whole trick: a human's click on the email lands here in a real browser
// and records in one tap, while an email scanner's prefetch never runs
// this effect and records nothing.
export default function RateExperience({ token, initialStars = 0 }) {
  const [stars, setStars] = useState(initialStars);
  const [saved, setSaved] = useState(0); // last rating the server confirmed
  const [comment, setComment] = useState("");
  const [commentSaved, setCommentSaved] = useState(false);
  const [error, setError] = useState(null);
  const submitting = useRef(false);

  async function submit({ nextStars, nextComment }) {
    if (submitting.current) return;
    submitting.current = true;
    setError(null);
    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...(nextStars ? { stars: nextStars } : {}),
          ...(nextComment ? { comment: nextComment } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `error ${res.status}`);
      }
      if (nextStars) setSaved(nextStars);
      if (nextComment) setCommentSaved(true);
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      submitting.current = false;
    }
  }

  // The star from the email records itself on arrival.
  useEffect(() => {
    if (token && initialStars) {
      submit({ nextStars: initialStars });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-base font-semibold text-slate-900">
          This page only works from the link in your rating email.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Lost it? Write to hello@testedroutes.com and we'll sort you out.
        </p>
      </div>
    );
  }

  const pick = (n) => {
    setStars(n);
    submit({ nextStars: n });
  };

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Two weeks in</p>
      <h1 className="mt-2 font-serif text-2xl font-normal text-brand-ink md:text-3xl">
        {saved ? "Thank you – rating saved." : "How did the guide hold up?"}
      </h1>

      <div className="mt-5 flex gap-2" role="radiogroup" aria-label="Rating, 1 to 5 stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => pick(n)}
            className={`text-4xl leading-none transition ${
              n <= stars ? "text-brand-terracotta" : "text-slate-300 hover:text-slate-400"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        1 = missed badly · 5 = worked like a plan should. Tap again to adjust –
        the newest rating counts.
      </p>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <label htmlFor="rating-comment" className="text-sm font-medium text-slate-900">
          Anything specific? <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="rating-comment"
          rows={4}
          maxLength={2000}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setCommentSaved(false);
          }}
          placeholder="A closed trail, a changed fare, a better option – whatever didn't match, or did."
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
        <button
          type="button"
          disabled={!comment.trim() || commentSaved}
          onClick={() => submit({ nextComment: comment.trim() })}
          className="mt-3 rounded-full bg-brand-terracotta px-5 py-2.5 text-xs font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 disabled:cursor-default disabled:opacity-40"
        >
          {commentSaved ? "Sent – thank you" : "Send comment"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700">
          That didn't save ({error}). Try again, or just reply to the email –
          it reaches a person.
        </p>
      ) : null}
    </div>
  );
}
