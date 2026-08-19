"use client";

import { useEffect, useRef, useState } from "react";

// Only direct video files can autoplay inline; page links (YouTube, TikTok)
// would need an iframe, which is too heavy for a card.
export const PLAYABLE_VIDEO = /\.(mp4|webm|mov)(\?|#|$)/i;

// Shared slide recipe for cards and galleries. Each video keeps its authored
// position in the sequence (slot is 1-based, from the source filename like
// {ID}_3-detail.mp4); without a slot it leads. `videos` is [{ url, slot }];
// legacy single videoUrl/videoSlot still works as a fallback.
export function buildMediaSlides({ photos = [], videoUrl = null, videoSlot = null, videos = null }) {
  const slides = photos.map((src) => ({ type: "image", src }));
  const clips =
    Array.isArray(videos) && videos.length
      ? videos
      : videoUrl
        ? [{ url: videoUrl, slot: videoSlot }]
        : [];
  clips
    .filter((v) => v?.url && PLAYABLE_VIDEO.test(v.url))
    .sort((a, b) => (Number(a.slot) || 1) - (Number(b.slot) || 1))
    .forEach((v) => {
      // Slots are positions in the full media sequence, so inserting in
      // ascending order lands each clip at its authored index.
      const idx = Math.max(0, Math.min(slides.length, (Number(v.slot) || 1) - 1));
      slides.splice(idx, 0, { type: "video", src: v.url, poster: photos[0] });
    });
  return slides;
}

// Browse pages hold dozens of cards, each a Sanity CDN rendition baked at one
// width — so a phone was downloading the 1080px cut of every photo. The CDN
// resizes via the `w` query param, so a srcset is just the same URL at three
// widths; the browser picks. Non-Sanity URLs (or ones without a `w`) get no
// srcset and behave exactly as before.
const SRCSET_WIDTHS = [480, 720, 1080];
function sanitySrcSet(src) {
  if (!/^https:\/\/cdn\.sanity\.io\//.test(src || "") || !/[?&]w=\d+/.test(src)) return undefined;
  return SRCSET_WIDTHS.map(
    (w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`,
  ).join(", ");
}
// Card grids run 3-up on desktop, 2-up on tablet, full width on phones.
// Callers with a different geometry can override.
const DEFAULT_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

// Muted looping clip that plays only while at least half visible — swiping
// to another slide or scrolling the card away pauses it. No poster: the
// photo-to-first-frame swap reads as a jump, so the clip stays invisible
// (container bg shows) until it has frames, then fades in.
//
// hoverOnly (founder 2026-08-08, inspire cards): on hover-capable devices
// the clip sits frozen on its first frame and only plays while the pointer
// is over it. Touch devices keep the autoplay-when-visible behavior — there
// is no hover to wait for.
//
// The element mounts with no src at all. A browse page holds well over a
// hundred of these, and preload="metadata" on each meant the browser opened
// them all at page load — that connection storm was most of the "few
// seconds to flip pages" the founder reported. The src attaches when the
// card scrolls within ~200px of the viewport; until then the clip costs
// nothing.
function CardVideo({ src, title, className = "h-full w-full object-cover", hoverOnly = false }) {
  const ref = useRef(null);
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const hovering = useRef(false);
  const visible = useRef(false);

  // Near-viewport activation, separate from the play/pause observer below:
  // loading should start a little before the card is seen, playing only
  // once it genuinely is.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActivated(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !activated) return;
    const hoverCapable =
      hoverOnly &&
      typeof matchMedia !== "undefined" &&
      matchMedia("(hover: hover) and (pointer: fine)").matches;

    const sync = () => {
      const shouldPlay = visible.current && (!hoverCapable || hovering.current);
      if (shouldPlay) el.play().catch(() => {});
      else el.pause();
    };

    // Media events race hydration; poll readyState until frames exist.
    // preload="metadata" alone never decodes a frame, so the frozen
    // hover-only clip nudges currentTime to force the first frame in.
    // Capped: a clip that 404s or never buffers used to keep this timer
    // alive for the life of the page — after ~15s it gives up and the
    // slide keeps showing the container background.
    let attempts = 0;
    const poll = setInterval(() => {
      attempts += 1;
      if (hoverCapable && el.readyState < 2 && el.readyState >= 1 && el.currentTime === 0) {
        try {
          el.currentTime = 0.001;
        } catch {}
      }
      if (el.readyState >= 2) {
        setReady(true);
        clearInterval(poll);
      } else if (attempts >= 60) {
        clearInterval(poll);
      }
    }, 250);

    const onEnter = () => {
      hovering.current = true;
      sync();
    };
    const onLeave = () => {
      hovering.current = false;
      sync();
    };
    if (hoverCapable) {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }

    if (typeof IntersectionObserver === "undefined") {
      visible.current = true;
      sync();
      return () => {
        clearInterval(poll);
        if (hoverCapable) {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        }
      };
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      clearInterval(poll);
      observer.disconnect();
      if (hoverCapable) {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [hoverOnly, activated]);

  return (
    <video
      ref={ref}
      src={activated ? src : undefined}
      muted
      loop
      playsInline
      preload={activated ? "metadata" : "none"}
      aria-label={title}
      className={`${className} transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

// Swipeable media strip for cards: touch swipe via scroll-snap, hover arrows
// on desktop, dot indicators. Expects an absolutely-positioned/fixed-aspect
// parent. slides: [{ type: "image" | "video", src, poster? }].
//
// Fit is per slide, because one guide carousel holds two kinds of media.
// Photos and clips were framed for the card and fill it edge to edge, crop
// and all. Page exports out of the guide are a different thing: cropping one
// to the frame cuts off the page a buyer is trying to read, so those show
// whole on the neutral track, sized by height — the same treatment the guide
// page carousel gives them. A slide opts in with fit: "contain"; `fit` sets
// the default for slides that don't carry one.
//
// Only the first slide's media mounts up front. With ~5 slides per card and
// dozens of cards per browse page, mounting every slide meant hundreds of
// media elements fetched eagerly for slides nobody had swiped to. The rest
// mount on the first sign of intent — pointer over the strip, an arrow
// click, or the strip scrolling. The slide wrappers themselves always
// render, so scroll-snap geometry and the dot count never change.
export default function CardMediaCarousel({
  slides,
  alt,
  imgClassName = "",
  eagerFirstSlide = false,
  fit = "cover",
  videoHoverOnly = false,
  sizes = DEFAULT_SIZES,
}) {
  const isContain = (slide) => (slide.fit || fit) === "contain";
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const stripRef = useRef(null);
  const expand = () => setExpanded(true);

  const scrollToIndex = (i) => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const target = (i + slides.length) % slides.length;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };
  const prev = (e) => {
    e.preventDefault();
    expand();
    scrollToIndex(idx - 1);
  };
  const next = (e) => {
    e.preventDefault();
    expand();
    scrollToIndex(idx + 1);
  };
  const onScroll = () => {
    expand();
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(Math.min(Math.max(i, 0), slides.length - 1));
  };

  if (!Array.isArray(slides) || !slides.length) return null;

  return (
    <>
      <div
        ref={stripRef}
        onScroll={onScroll}
        onPointerEnter={expand}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => {
          const contain = isContain(slide);
          const mediaClass = contain
            ? "h-full w-auto max-w-full rounded-lg object-contain"
            : "h-full w-full object-cover";
          const mountMedia = i === 0 || expanded;
          return (
            <div
              key={`${i}-${slide.src}`}
              className={`h-full w-full shrink-0 snap-center overflow-hidden ${
                contain ? "flex items-center justify-center px-2 py-2" : ""
              }`}
            >
              {!mountMedia ? (
                // Placeholder keeps the slide's width in the snap strip;
                // the real media mounts when `expanded` flips.
                <div className="h-full w-full bg-slate-100" aria-hidden="true" />
              ) : slide.type === "video" ? (
                <CardVideo
                  src={slide.src}
                  poster={slide.poster}
                  title={alt}
                  className={mediaClass}
                  hoverOnly={videoHoverOnly}
                />
              ) : (
                <img
                  src={slide.src}
                  srcSet={sanitySrcSet(slide.src)}
                  sizes={sanitySrcSet(slide.src) ? sizes : undefined}
                  alt={alt}
                  loading={i === 0 && eagerFirstSlide ? undefined : "lazy"}
                  decoding="async"
                  // Hover zoom only where the frame is filled: scaling a
                  // contained page pushes its edges into the overflow clip.
                  className={`${mediaClass} ${contain ? "" : imgClassName}`}
                />
              )}
            </div>
          );
        })}
      </div>
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M10.72 3.22a.75.75 0 0 1 0 1.06L6.56 8l4.16 3.72a.75.75 0 1 1-1 1.12l-4.72-4.22a.75.75 0 0 1 0-1.12l4.72-4.22a.75.75 0 0 1 1.06-.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M5.28 3.22a.75.75 0 0 0 0 1.06L9.44 8 5.28 11.72a.75.75 0 1 0 1 1.12l4.72-4.22a.75.75 0 0 0 0-1.12L6.28 3.28a.75.75 0 0 0-1 -.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                // White reads on a photo but vanishes on the neutral track a
                // contained page sits on, so the dots follow the active slide.
                className={`block h-1.5 w-1.5 rounded-full ${
                  isContain(slides[idx] || {})
                    ? i === idx
                      ? "bg-slate-600"
                      : "bg-slate-300"
                    : i === idx
                      ? "bg-white"
                      : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
