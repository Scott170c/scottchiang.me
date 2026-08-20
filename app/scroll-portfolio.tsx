"use client";

import {
  Fragment,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import projectItemsData from "../data/projects.json";
import {
  FOOTER_REGION_COLORS,
  footerArtDesktop,
  footerArtMobile,
  type FooterArtVariant,
} from "../lib/footer-art";
import type { ProjectItem } from "../lib/types";

type PortfolioSection = {
  id: string;
  label: string;
};

type ScrollPortfolioProps = {
  sections: PortfolioSection[];
};

type SidebarNavItemProps = {
  section: PortfolioSection;
  index: number;
  isActive: boolean;
  smoothSectionProgress: MotionValue<number>;
};

type ContentSectionProps = {
  section: PortfolioSection;
  index: number;
};

type SocialLink = {
  label: string;
  href: string;
  iconSrc: string;
  iconClassName?: string;
};

type MediaItem = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
};

const scottDisplayFont = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
});

// Replace the href values here with your real social profile links.
const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/scott170c",
    iconSrc: "/social-icons/github.png",
    iconClassName: "h-10 w-10",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chiangscott",
    iconSrc: "/social-icons/linkedin.png",
    iconClassName: "h-10 w-10",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/BRUHisbackbois",
    iconSrc: "/social-icons/instagram.png",
    iconClassName: "h-12 w-12",
  },
  {
    label: "Email",
    href: "mailto:scottchiang7@gmail.com",
    iconSrc: "/social-icons/email.png",
    iconClassName: "h-14 w-14",
  },
];

const repoHref = "https://github.com/scott170c/scottchiang.me";

// Add photos to /public and reference them like "/robot-dog.jpg".
const mediaItems: MediaItem[] = [
  {
    title: "LAHacks 2026",
    eyebrow: "Linkedin Post",
    description: "LA Hacks 2026 hardware project post on LinkedIn.",
    href: "https://www.linkedin.com/posts/chiangscott_lahacks-hackathons-hardware-share-7455792654304567296-wDjJ/",
    imageSrc: "/lahacks-2026.png",
    imageAlt: "LAHacks 2026 project photo",
  },
  {
    title: "VIA Rail x Hack Club Hackathon",
    eyebrow: "Article",
    description: "VIA Rail press release about Hack Club's Boreal Express journey.",
    href: "https://media.viarail.ca/en/press-releases/2024/50-young-hack-club-coders-champion-sustainable-future-rails-canadian",
    imageSrc: "/the-canadian.jpg",
    imageAlt: "The Canadian train traveling through mountain scenery",
  },
  {
    title: "Highlight",
    eyebrow: "Media",
    description: "A place for a demo video, press link, or project highlight.",
    href: "https://example.com/media",
    imageSrc: "",
    imageAlt: "Media placeholder",
  },
];

const projectItems = projectItemsData as ProjectItem[];

const techStack = {
  languages: [
    { label: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { label: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { label: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
    { label: "CSS", icon: "https://cdn.simpleicons.org/css/663399" },
    { label: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
    { label: "Java", icon: "https://cdn.simpleicons.org/openjdk/437291" },
    { label: "C++", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
    { label: "MATLAB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
  ],
  web: [
    { label: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { label: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { label: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { label: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
    { label: "Vercel", icon: "https://cdn.simpleicons.org/vercel/000000" },
  ],
  hardware: [
    { label: "Arduino", icon: "https://cdn.simpleicons.org/arduino/00878F" },
    { label: "Raspberry Pi", icon: "https://cdn.simpleicons.org/raspberrypi/A22846" },
    { label: "ESP32", icon: "https://cdn.simpleicons.org/espressif/E7352C" },
    { label: "ROS2", icon: "https://cdn.simpleicons.org/ros/22314E" },
  ],
  tools: [
    { label: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
    { label: "GitHub", icon: "https://cdn.simpleicons.org/github/181717" },
    { label: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    { label: "Claude Code", icon: "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/claudecode-color.svg" },
    { label: "Codex", icon: "/tech-icons/codex-color-transparent.svg" },
  ],
  design: [
    { label: "KiCad", icon: "https://upload.wikimedia.org/wikipedia/commons/6/65/KiCad_logo_square.svg" },
    { label: "EasyEDA", icon: "https://cdn.simpleicons.org/easyeda/1765F6" },
    { label: "Fusion 360", icon: "https://cdn.simpleicons.org/autodesk/000000" },
  ],
};

const techStackItems = [
  ...techStack.languages,
  ...techStack.web,
  ...techStack.hardware,
  ...techStack.tools,
  ...techStack.design,
];

const sectionCopy: Record<string, { title: ReactNode; body: ReactNode }> = {
  home: {
    title: (
      <p>
        Hi, I&apos;m{" "}
        <span className={`${scottDisplayFont.className} inline-block text-[1.3em] font-black [-webkit-text-stroke:0.75px_currentColor]`}>
          Scott
        </span>
      </p>
    ),
    body: <h4 style={{ fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.5 }}>I left high school early, now I'm an <b>MTS Intern @ RobotX AI</b> and studying <b>Data Science @ IVC</b> </h4>
  },
  projects: {
    title: "My Works",
    body: "Some things I've worked on or am currently working on",
  },
  work: {
    title: "Robot dog showcase",
    body: "A future focal section for hardware, autonomy, controls, perception, and field testing details.",
  },
  research: {
    title: "Research notes",
    body: "A compact section for experiments, reading notes, simulation work, and technical observations.",
  },
  about: {
    title: "A little more about me",
    body: "I like building at the intersection of robotics, data, and useful interfaces. Right now, I am especially interested in systems that connect physical hardware with clean software tools, whether that means robot behavior, field testing, data pipelines, or visualizing what a machine is doing in the real world.",
  },
  socials: {
    title: "",
    body: "",
  },
};

const navItemStep = 52;
const tickerCenterOffset = 22;
const sidebarTextClass =
  "font-[var(--font-geist-sans)] font-bold uppercase tracking-[0.24em]";

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function SidebarNavItem({
  section,
  index,
  isActive,
  smoothSectionProgress,
}: SidebarNavItemProps) {
  const inputRange = [index - 2, index, index + 2];
  const fontSize = useTransform(smoothSectionProgress, inputRange, [10.5, 12.75, 10.5]);
  const fontWeight = useTransform(smoothSectionProgress, inputRange, [500, 760, 500]);
  const opacity = useTransform(smoothSectionProgress, inputRange, [0.66, 1, 0.66]);
  const x = useTransform(smoothSectionProgress, inputRange, [0, 4, 0]);
  const color = useTransform(
    smoothSectionProgress,
    inputRange,
    ["#8a8175", "#1d1a16", "#8a8175"],
  );

  return (
    <motion.a
      href={`#${section.id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToSection(section.id);
      }}
      className="relative flex min-h-11 items-center overflow-hidden rounded-lg px-4 py-2.5 text-[#8a8175] transition-colors duration-300 hover:text-[#1d1a16]"
      animate={{
        paddingLeft: isActive ? 18 : 16,
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 30,
        mass: 0.75,
      }}
    >
      <motion.span
        className={["relative z-10", sidebarTextClass].join(" ")}
        style={{ color, fontSize, fontWeight, opacity, x }}
      >
        {section.label}
      </motion.span>
    </motion.a>
  );
}

// ASCII art banner. Renders the pre at 10px in `w-max` so it takes its full
// natural line width, then transform-scales the whole thing to exactly fill
// the container -- sidesteps the browser's ~4-6px minimum font-size floor so
// the grid still fits on narrow viewports without clipping.
//
// Non-space characters are individual <span>s indexed by (row, col) so
// pointermove can scramble a radius around the cursor and restore when the
// cursor moves away. Spaces stay as plain text to keep the DOM count sane.
//
// Two art variants live in lib/footer-art.ts -- desktop is wide and short,
// mobile is narrow and tall -- and we swap between them via matchMedia so
// each viewport gets a scene that reads well at its natural aspect ratio.
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

function useFooterArtVariant(): FooterArtVariant {
  const [variant, setVariant] = useState<FooterArtVariant>(footerArtDesktop);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const apply = () => setVariant(mq.matches ? footerArtMobile : footerArtDesktop);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return variant;
}

function FooterAsciiArt({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const cellsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const variant = useFooterArtVariant();
  const { lines, columns, classify } = variant;

  // Character pool for hover scrambles -- drawn from the current variant's own
  // non-space glyphs so scrambled cells stay visually native to the scene.
  const obfuscationPool = useMemo(
    () => Array.from(new Set(lines.join("").replace(/\s/g, ""))).join(""),
    [lines],
  );

  // Fit-to-container. Re-runs when the variant changes because the pre's
  // natural size changes with it.
  useEffect(() => {
    const container = containerRef.current;
    const pre = preRef.current;
    if (!container || !pre) return;

    const fit = () => {
      pre.style.transform = "none";
      const natural = pre.offsetWidth;
      const naturalH = pre.offsetHeight;
      if (natural === 0) return;
      const scale = container.clientWidth / natural;
      pre.style.transformOrigin = "top left";
      pre.style.transform = `scale(${scale})`;
      container.style.height = `${naturalH * scale}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const RADIUS = 3;
    const rows = lines.length;
    const cells = cellsRef.current;
    const originals = new Map<HTMLSpanElement, string>();
    let scrambled = new Set<HTMLSpanElement>();

    // rAF-throttled state: pointermove can fire 100+ times/sec, but we only
    // need one scramble per animation frame. Storing the latest event and
    // running the actual work in a rAF callback keeps the scroll thread clean.
    let latestX = 0;
    let latestY = 0;
    let frameId: number | null = null;

    const runScramble = () => {
      frameId = null;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const col = Math.floor(((latestX - rect.left) / rect.width) * columns);
      const row = Math.floor(((latestY - rect.top) / rect.height) * rows);

      const next = new Set<HTMLSpanElement>();
      for (let dr = -RADIUS; dr <= RADIUS; dr++) {
        for (let dc = -RADIUS; dc <= RADIUS; dc++) {
          const span = cells.get(`${row + dr},${col + dc}`);
          if (!span) continue;
          if (!originals.has(span)) {
            originals.set(span, span.textContent ?? "");
          }
          span.textContent =
            obfuscationPool[
              Math.floor(Math.random() * obfuscationPool.length)
            ];
          next.add(span);
        }
      }

      scrambled.forEach((span) => {
        if (!next.has(span)) {
          const orig = originals.get(span);
          if (orig !== undefined) span.textContent = orig;
        }
      });
      scrambled = next;
    };

    const onMove = (event: PointerEvent) => {
      latestX = event.clientX;
      latestY = event.clientY;
      if (frameId === null) {
        frameId = requestAnimationFrame(runScramble);
      }
    };

    const onLeave = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      scrambled.forEach((span) => {
        const orig = originals.get(span);
        if (orig !== undefined) span.textContent = orig;
      });
      scrambled.clear();
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [lines, columns, obfuscationPool]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={["overflow-hidden", className ?? ""].join(" ")}
    >
      <pre
        ref={preRef}
        // A unique key per variant clears the ref map when the art swaps so
        // stale (row, col) entries from the previous variant don't linger.
        key={variant === footerArtMobile ? "mobile" : "desktop"}
        className="m-0 w-max whitespace-pre font-[var(--font-geist-mono)] text-[10px] leading-[1.05]"
      >
        {lines.map((line, r) => (
          <Fragment key={r}>
            {Array.from(line).map((ch, c) => {
              if (ch === " ") return " ";
              const region = classify(r, c);
              return (
                <span
                  key={c}
                  ref={(el) => {
                    const key = `${r},${c}`;
                    if (el) cellsRef.current.set(key, el);
                    else cellsRef.current.delete(key);
                  }}
                  style={{ color: FOOTER_REGION_COLORS[region] }}
                >
                  {ch}
                </span>
              );
            })}
            {"\n"}
          </Fragment>
        ))}
      </pre>
    </div>
  );
}

// Small reusable styles so the two link groups match exactly.
const footerLabelClass =
  "font-[var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.24em] text-[#8a6a44]";
const footerLinkClass =
  "font-[var(--font-geist-mono)] text-[0.78rem] uppercase tracking-[0.14em] text-[#1d1a16] underline decoration-[#cfc6b8] decoration-1 underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] duration-200 hover:decoration-[#1d1a16] hover:decoration-2";

function FooterLinkGroup({
  label,
  children,
  alignRight,
}: {
  label: string;
  children: ReactNode;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? "md:text-right" : ""}>
      <p className={footerLabelClass}>{label}</p>
      <div
        className={[
          "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1",
          alignRight ? "justify-center md:justify-end" : "justify-center md:justify-start",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <div className="text-sm text-[#756c61]">
      <div className="grid gap-10 text-center md:grid-cols-[1fr_auto] md:items-start md:gap-16 md:text-left">
        {/* Left: brand block */}
        <div>
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("home");
            }}
            className={[
              "text-[#1d1a16] underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-200 hover:decoration-[#1d1a16]",
              sidebarTextClass,
            ].join(" ")}
          >
            SCOTT CHIANG
          </a>
          <p className="mt-4 max-w-sm text-[0.9rem] leading-6">
            Student, Maker, and Robotics Enthusiast
          </p>
        </div>

        {/* Right: two grouped link sections stacked, both right-aligned on desktop */}
        <div className="flex flex-col items-center gap-6 md:items-end md:gap-5">
          <FooterLinkGroup label="Connect" alignRight>
            {socialLinks.map(({ label, href }, i) => {
              const isEmail = href.startsWith("mailto:");
              return (
                <Fragment key={label}>
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-[#c8bdad]">
                      ·
                    </span>
                  ) : null}
                  <a
                    className={footerLinkClass}
                    href={href}
                    rel={isEmail ? undefined : "noreferrer"}
                    target={isEmail ? undefined : "_blank"}
                  >
                    {label}
                  </a>
                </Fragment>
              );
            })}
          </FooterLinkGroup>

          <FooterLinkGroup label="Elsewhere" alignRight>
            <a
              className={footerLinkClass}
              href={repoHref}
              rel="noreferrer"
              target="_blank"
            >
              View Repo
            </a>
          </FooterLinkGroup>
        </div>
      </div>
    </div>
  );
}

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const hasImage = Boolean(item.imageSrc);
  const cardStyle = {
    "--tilt": index % 2 === 0 ? "-1.25deg" : "1.25deg",
  } as CSSProperties;

  return (
    <a
      className="group block w-full max-w-[19rem] text-left [transform:translateZ(0)] [will-change:transform] transition duration-200 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
      href={item.href}
      rel={item.href.startsWith("#") ? undefined : "noreferrer"}
      style={cardStyle}
      target={item.href.startsWith("#") ? undefined : "_blank"}
      title={item.description}
    >
      <div className="h-full rotate-[var(--tilt)] transition duration-300 ease-out group-hover:rotate-0">
        <div className="relative isolate aspect-[4/3] overflow-hidden rounded-md bg-[#f8f5ee] shadow-[0_18px_46px_rgba(29,26,22,0.08)] transition duration-300 ease-out [clip-path:inset(0_round_6px)] group-hover:shadow-[0_26px_56px_rgba(29,26,22,0.14)]">
          {hasImage ? (
            <img
              alt={item.imageAlt ?? item.title}
              className="block h-full w-full object-cover opacity-90 grayscale-[8%] transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100 group-hover:grayscale-0"
              decoding="async"
              loading="lazy"
              src={item.imageSrc}
            />
          ) : (
            <div className="relative h-full w-full bg-[#f7f3eb]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,26,22,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(29,26,22,0.055)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute left-8 top-8 h-6 w-6 rounded-full bg-[#1d1a16]/85" />
              <div className="absolute right-10 top-9 h-10 w-10 rounded-full border border-[#a88961]" />
              <div className="absolute bottom-10 left-8 h-px w-32 rotate-[-10deg] bg-[#1d1a16]/25" />
              <div className="absolute bottom-14 left-16 h-px w-28 rotate-[16deg] bg-[#1d1a16]/15" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-white/86 px-4 py-3.5 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-full">
            <p className="font-[var(--font-geist-mono)] text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#8a6a44]">
              {item.eyebrow}
            </p>
            <h2 className="truncate text-[1.3rem] font-medium leading-tight text-[#1d1a16]">
              {item.title}
            </h2>
          </div>
        </div>
      </div>
    </a>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const isPlaceholder = project.href === "#";
  const hasImage = Boolean(project.imageSrc);

  return (
    <a
      className="group block text-left [transform:translateZ(0)] [will-change:transform] transition duration-200 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
      href={project.href}
      rel={isPlaceholder ? undefined : "noreferrer"}
      target={isPlaceholder ? undefined : "_blank"}
    >
      <div className="h-full rounded-lg border border-[#eee8de] bg-[#fffdfa] p-1.5 shadow-[0_14px_38px_rgba(29,26,22,0.035)] transition duration-300 group-hover:border-[#ded8cc] group-hover:shadow-[0_20px_46px_rgba(29,26,22,0.06)]">
        <div className="relative isolate aspect-video overflow-hidden rounded-md bg-[#f8f5ee] shadow-[0_12px_34px_rgba(29,26,22,0.035)] [clip-path:inset(0_round_6px)]">
          {hasImage ? (
            <img
              alt={project.imageAlt ?? project.title}
              className="block h-full w-full object-cover grayscale-[8%] transition duration-300 group-hover:scale-[1.01] group-hover:grayscale-0"
              decoding="async"
              loading="lazy"
              src={project.imageSrc}
            />
          ) : (
            <div className="relative h-full w-full bg-[#f7f3eb]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,26,22,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(29,26,22,0.055)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute left-8 top-8 h-2 w-28 rounded-full bg-[#1d1a16]/16" />
              <div className="absolute left-8 top-14 h-2 w-44 rounded-full bg-[#1d1a16]/9" />
              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-[1fr_0.72fr] gap-4">
                <div className="h-28 rounded-md border border-[#1d1a16]/10 bg-white/70" />
                <div className="grid gap-4">
                  <div className="rounded-md border border-[#1d1a16]/10 bg-white/70" />
                  <div className="rounded-md border border-[#1d1a16]/10 bg-white/70" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-2 pt-2.5 pb-2.5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[1rem] font-medium leading-tight text-[#1d1a16]">
              {project.title}
            </h2>
            <p className="shrink-0 pr-1 pt-0.5 text-right text-[0.72rem] font-normal lowercase tracking-normal text-[#756c61]">
              {project.status}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

function TechStackStrip() {
  return (
    <div className="mt-8 max-w-5xl rounded-lg border border-[#eee8de] bg-[#fffdfa] p-4 shadow-[0_14px_38px_rgba(29,26,22,0.025)] sm:p-5">
      <div className="grid gap-3">
        <p className="font-[var(--font-geist-mono)] text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8a6a44]">
          <b>Tech stack</b>
        </p>
        <div className="flex flex-wrap gap-2">
          {techStackItems.map((tool) => (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3eb] px-3 py-1 font-[var(--font-geist-mono)] text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#625a50]"
              key={tool.label}
              title={tool.label}
            >
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-3.5 max-w-8 object-contain"
                    decoding="async"
                    loading="lazy"
                    src={tool.icon}
              />
              {tool.label}
            </span>
          ))}
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[#756c61]">
          
        </p>
      </div>
    </div>
  );
}

function ContentSection({
  section,
  index,
}: ContentSectionProps) {
  const copy = sectionCopy[section.id] ?? {
    title: section.label,
    body: "Placeholder section.",
  };

  if (section.id === "socials") {
    // -mx-* on the ASCII art escapes the ScrollPortfolio's horizontal padding
    // so the art paints edge-to-edge across the whole content area (past the
    // sidebar), letting each character render as large as possible.
    return (
      <footer id={section.id} className="scroll-mt-8 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl text-center md:text-left">
          <SiteFooter />
        </div>
        <FooterAsciiArt className="mt-12 pb-10" />
      </footer>
    );
  }

  return (
    <section
      id={section.id}
      className={[
        "relative grid min-h-screen scroll-mt-8 py-24",
        section.id === "home" ? "place-items-start sm:py-32" : "place-items-center",
      ].join(" ")}
    >
      <div
        className={[
          "w-full max-w-5xl text-center md:text-left",
          section.id === "home" ? "pt-44 sm:pt-20" : "",
          section.id === "socials" ? "w-full" : "",
        ].join(" ")}
      >
        <p
          className="mb-5 font-[var(--font-geist-mono)] text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6a44]"
        >
          [{String(index + 1).padStart(2, "0")}] {section.label}
        </p>
        <h1
          className="text-5xl font-bold tracking-normal sm:text-7xl"
        >
          {copy.title}
        </h1>
        <div
          className={[
            "mx-auto w-full text-lg leading-8 text-[#625a50] md:mx-0",
            section.id === "home" ? "mt-3 max-w-[68rem]" : "mt-7 max-w-none",
          ].join(" ")}
        >
          {copy.body}
        </div>
        {section.id === "home" ? (
          <div
            className="mx-auto mt-10 grid w-full max-w-xs grid-cols-1 justify-items-center gap-4 overflow-visible px-2 py-4 sm:max-w-5xl sm:grid-cols-3 sm:gap-6 sm:px-0"
          >
            {mediaItems.map((item, mediaIndex) => (
              <MediaCard item={item} index={mediaIndex} key={item.title} />
            ))}
          </div>
        ) : null}
        {section.id === "projects" ? (
          <div className="mt-10 md:pl-6 lg:pl-8">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 md:mx-0">
              {projectItems.map((project, projectIndex) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={projectIndex}
                />
              ))}
            </div>
            <TechStackStrip />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ScrollPortfolio({ sections }: ScrollPortfolioProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [isDraggingTicker, setIsDraggingTicker] = useState(false);
  const navRailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const maxTickerY = (sections.length - 1) * navItemStep;
  const sectionProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, sections.length - 1)],
  );
  const smoothSectionProgress = useSpring(sectionProgress, {
    stiffness: 115,
    damping: 24,
    mass: 0.55,
  });
  const tickerY = useTransform(
    smoothSectionProgress,
    [0, Math.max(1, sections.length - 1)],
    [0, maxTickerY],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.round(latest * (sections.length - 1));
    const nextSection = sections[Math.min(sections.length - 1, Math.max(0, nextIndex))];

    if (nextSection) {
      setActiveId(nextSection.id);
    }
  });

  const scrollToTickerPoint = (clientY: number) => {
    const rail = navRailRef.current;

    if (!rail) {
      return;
    }

    const rect = rail.getBoundingClientRect();
    const rawY = clientY - rect.top - tickerCenterOffset;
    const progress =
      maxTickerY > 0 ? Math.min(1, Math.max(0, rawY / maxTickerY)) : 0;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: progress * maxScroll,
      behavior: "auto",
    });
  };

  return (
    <main className="min-h-screen bg-white text-[#1d1a16]">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-60 md:block">
        <nav className="flex h-full flex-col justify-between px-5 py-7">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("home");
            }}
            className={[
              "text-sm text-[#1d1a16]",
              sidebarTextClass,
            ].join(" ")}
          >
            &nbsp;&nbsp;SCOTT CHIANG
          </a>

          <div
            ref={navRailRef}
            className="relative grid gap-2 pl-5"
          >
            <div
              className={[
                "absolute bottom-2 left-[-8px] top-2 z-20 w-5",
                isDraggingTicker ? "cursor-grabbing" : "cursor-grab",
              ].join(" ")}
              aria-label="Scroll through sections"
              role="slider"
              tabIndex={0}
              onPointerDown={(event) => {
                setIsDraggingTicker(true);
                event.currentTarget.setPointerCapture(event.pointerId);
                scrollToTickerPoint(event.clientY);
              }}
              onPointerMove={(event) => {
                if (isDraggingTicker) {
                  scrollToTickerPoint(event.clientY);
                }
              }}
              onPointerUp={(event) => {
                setIsDraggingTicker(false);
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => setIsDraggingTicker(false)}
            />
            <div className="absolute bottom-2 left-0 top-2 w-px bg-[#d8d1c4]" />
            <motion.div
              className={[
                "pointer-events-none absolute left-[-3px] top-1.5 h-8 w-[7px] rounded-full bg-[#1d1a16] shadow-[0_0_18px_rgba(90,76,58,0.18)]",
                isDraggingTicker ? "cursor-grabbing" : "cursor-grab",
              ].join(" ")}
              style={{ y: tickerY }}
            />
            {sections.map((section, index) => {
              const isActive = activeId === section.id;

              return (
                <SidebarNavItem
                  key={section.id}
                  section={section}
                  index={index}
                  isActive={isActive}
                  smoothSectionProgress={smoothSectionProgress}
                />
              );
            })}
          </div>

          <p className="text-xs leading-5 text-[#8a8175]"></p>
        </nav>
      </aside>

      <nav className="fixed left-4 right-4 top-4 z-40 flex items-center justify-between rounded-full border border-[#ded8cc] bg-[#fbf8f1]/90 px-4 py-3 backdrop-blur md:hidden">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("home");
          }}
          className="text-xs font-semibold tracking-[0.18em]"
        >
          SCOTT
        </a>
        <div className="flex gap-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(section.id);
              }}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                activeId === section.id ? "bg-[#1d1a16]" : "bg-[#c8bdad]",
              ].join(" ")}
              aria-label={`Go to ${section.label}`}
            />
          ))}
        </div>
      </nav>

      <div className="relative mx-auto max-w-7xl px-8 sm:px-12 md:ml-60 lg:px-16 xl:px-20">
        {sections.map((section, index) => (
          <ContentSection
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>
    </main>
  );
}
