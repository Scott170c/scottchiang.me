"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
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
import { animate, stagger } from "animejs";

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
  smoothSectionProgress: MotionValue<number>;
};

type SocialLink = {
  label: string;
  href: string;
  Icon: (props: { size?: number }) => ReactNode;
};

type MediaItem = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  rotation?: string;
};

function GithubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.1 19.2c-4.1 1.2-4.1-2-5.7-2.4m11.5 5.1v-3.2c0-.9-.3-1.5-.8-1.9 2.6-.3 5.3-1.3 5.3-5.8 0-1.3-.5-2.4-1.2-3.3.1-.3.5-1.6-.1-3.2 0 0-1-.3-3.3 1.2a11.1 11.1 0 0 0-6 0C6.5 4.2 5.5 4.5 5.5 4.5c-.6 1.6-.2 2.9-.1 3.2A4.7 4.7 0 0 0 4.2 11c0 4.5 2.7 5.5 5.3 5.8-.4.3-.7.9-.8 1.7v3.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LinkedinIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.8 10.2v7.5m0-10.6v.1m4.2 10.5v-7.5m0 3.2c0-2.2 1.4-3.4 3.2-3.4 2 0 3 1.3 3 3.6v4.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <rect
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
        width="16"
        x="4"
        y="4"
      />
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="15.5"
        rx="4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        width="15.5"
        x="4.25"
        y="4.25"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16.6 7.6h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function DiscordIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.1 7.7c2.6-.8 5.2-.8 7.8 0m-9.4 7.5c3.5 1.8 7.5 1.8 11 0 .7-2.5.5-5.1-.8-7.7a9 9 0 0 0-2.8-1.1l-.4.8a10 10 0 0 0-3 0l-.4-.8a9 9 0 0 0-2.8 1.1c-1.3 2.6-1.5 5.2-.8 7.7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.6 12.2h.01M14.4 12.2h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function ResumeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 3.75h6.2L17 7.55v12.7H7V3.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M13 4v4h4M9.3 11.2h5.4M9.3 14h5.4M9.3 16.8h3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EmailIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
        width="17"
        x="3.5"
        y="5"
      />
      <path
        d="m4.5 7.8 7.5 5.1 7.5-5.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}


// Replace the href values here with your real social profile links.
const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/yourusername",
    Icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yourusername",
    Icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yourusername",
    Icon: InstagramIcon,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    Icon: ResumeIcon,
  },
  {
    label: "Email",
    href: "mailto:scottchiang7@gmail.com",
    Icon: EmailIcon,
  },
];

const repoHref = "https://github.com/yourusername/scottchiang.me";

// Add photos to /public and reference them like "/robot-dog.jpg".
const mediaItems: MediaItem[] = [
  {
    title: "Build photo",
    eyebrow: "Photo",
    description: "A place for a personal photo, lab snapshot, or build image.",
    href: "#",
    imageSrc: "",
    imageAlt: "Build photo placeholder",
    rotation: "-2.5deg",
  },
  {
    title: "Feature",
    eyebrow: "Article",
    description: "A place for a profile, article, interview, or written feature.",
    href: "https://example.com/article",
    imageSrc: "",
    imageAlt: "Article placeholder",
    rotation: "1.75deg",
  },
  {
    title: "Highlight",
    eyebrow: "Media",
    description: "A place for a demo video, press link, or project highlight.",
    href: "https://example.com/media",
    imageSrc: "",
    imageAlt: "Media placeholder",
    rotation: "-1.25deg",
  },
];

const sectionCopy: Record<string, { title: string; body: ReactNode }> = {
  home: {
    title: "Hi, I'm Scott",
    body: <h4 style={{ fontSize: "1.3rem", fontWeight: 500 }}>I graduated high school early, now I'm a <b>Robotics Engineering Intern @ RobotX ∪ Data Science Transfer Student @ IVC</b> </h4>
  },
  projects: {
    title: "Selected projects",
    body: "Placeholder space for builds, prototypes, technical demos, and project writeups.",
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
  "font-[Arial,Helvetica,sans-serif] font-bold uppercase tracking-[0.24em]";

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

function SiteFooter() {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = artRef.current?.querySelectorAll(".footer-art-line");

    if (!lines?.length) {
      return;
    }

    const drift = animate(lines, {
      x: [0, 14, -8, 0],
      y: [0, -8, 6, 0],
      opacity: [0.22, 0.62, 0.34, 0.22],
      duration: 5600,
      delay: stagger(160),
      ease: "inOutSine",
      loop: true,
    });

    return () => {
      drift.revert();
    };
  }, []);

  return (
    <div className="border-t border-[#ded8cc] py-8 text-sm text-[#756c61]">
      <div className="grid gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:items-start md:text-left">
        <div>
          <a
            href="#home"
            className={[
              "text-[#1d1a16]",
              sidebarTextClass,
            ].join(" ")}
          >
            SCOTT CHIANG
          </a>
          <p className="mt-4 max-w-sm leading-6">
            Robotics engineering, data science, and interfaces for physical systems.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8a6a44]">
              Links
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => {
                const isEmail = href.startsWith("mailto:");

                return (
                  <a
                    key={label}
                    aria-label={label}
                    className="group grid h-12 w-12 place-items-center rounded-full border border-[#ded8cc] bg-white/90 text-[#4e463d] shadow-[0_12px_30px_rgba(29,26,22,0.05)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#1d1a16] hover:bg-white hover:text-[#1d1a16] hover:shadow-[0_16px_34px_rgba(29,26,22,0.09)] focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
                    href={href}
                    rel={isEmail ? undefined : "noreferrer"}
                    target={isEmail ? undefined : "_blank"}
                    title={label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
        </div>

        <div className="text-center md:text-right">
          <p>&copy; 2026 Scott Chiang.</p>
          <a
            className="mt-1 inline-block font-semibold text-[#1d1a16] underline decoration-[#cfc6b8] decoration-1 underline-offset-4 transition hover:decoration-[#1d1a16]"
            href={repoHref}
            rel="noreferrer"
            target="_blank"
          >
            View repository
          </a>
        </div>
      </div>

      <div
        ref={artRef}
        aria-hidden="true"
        className="mt-8 h-28 overflow-hidden border-t border-[#eee9df] pt-6"
      >
        <svg
          className="h-full w-full text-[#1d1a16]"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1200 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="footer-art-line"
            d="M40 114 C 210 34, 332 138, 496 72 S 790 28, 1160 92"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
          <path
            className="footer-art-line"
            d="M80 58 C 260 118, 382 20, 540 96 S 832 126, 1120 42"
            stroke="#a88961"
            strokeOpacity="0.32"
            strokeWidth="1.2"
          />
          <path
            className="footer-art-line"
            d="M20 132 C 170 86, 280 92, 392 118 S 640 118, 760 78 S 1010 42, 1180 118"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <circle className="footer-art-line" cx="260" cy="56" r="5" stroke="#a88961" strokeOpacity="0.45" />
          <circle className="footer-art-line" cx="760" cy="80" r="4" fill="currentColor" fillOpacity="0.18" />
          <circle className="footer-art-line" cx="1010" cy="46" r="6" stroke="currentColor" strokeOpacity="0.22" />
        </svg>
      </div>
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const hasImage = Boolean(item.imageSrc);
  const cardStyle = {
    "--card-rotation": item.rotation ?? "0deg",
  } as CSSProperties;

  return (
    <a
      className="group relative block aspect-[4/3] w-full max-w-72 rotate-[var(--card-rotation)] overflow-hidden rounded-lg border border-[#ded8cc] bg-white text-left shadow-[0_14px_34px_rgba(29,26,22,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:rotate-0 hover:border-[#1d1a16] hover:shadow-[0_20px_42px_rgba(29,26,22,0.1)] focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
      href={item.href}
      rel={item.href.startsWith("#") ? undefined : "noreferrer"}
      style={cardStyle}
      target={item.href.startsWith("#") ? undefined : "_blank"}
      title={item.description}
    >
      <div className="relative h-full overflow-hidden bg-[#fbfaf7]">
        {hasImage ? (
          <img
            alt={item.imageAlt ?? item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            src={item.imageSrc}
          />
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute left-6 top-6 h-5 w-5 rounded-full bg-[#1d1a16]" />
            <div className="absolute right-8 top-8 h-8 w-8 rounded-full border border-[#a88961]" />
            <div className="absolute bottom-8 left-8 h-px w-28 rotate-[-10deg] bg-[#cfc6b8]" />
            <div className="absolute bottom-12 left-16 h-px w-24 rotate-[16deg] bg-[#1d1a16]/35" />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-white/86 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-full">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a6a44]">
          {item.eyebrow}
        </p>
        <h2 className="truncate text-base font-semibold text-[#1d1a16]">{item.title}</h2>
      </div>
    </a>
  );
}

function ContentSection({
  section,
  index,
  smoothSectionProgress,
}: ContentSectionProps) {
  const copy = sectionCopy[section.id] ?? {
    title: section.label,
    body: "Placeholder section.",
  };
  const inputRange = [index - 1, index, index + 1];
  const opacity = useTransform(smoothSectionProgress, inputRange, [0.58, 1, 0.58]);
  const scale = useTransform(smoothSectionProgress, inputRange, [0.985, 1, 0.985]);
  const y = useTransform(
    smoothSectionProgress,
    inputRange,
    section.id === "home" ? [-32, -64, -96] : [28, 0, -28],
  );
  const titleWeight = useTransform(smoothSectionProgress, inputRange, [600, 700, 600]);
  const bodyOpacity = useTransform(smoothSectionProgress, inputRange, [0.62, 1, 0.62]);
  const eyebrowX = useTransform(smoothSectionProgress, inputRange, [-8, 0, 8]);
  const blur = useTransform(smoothSectionProgress, inputRange, [
    "blur(0.6px)",
    "blur(0px)",
    "blur(0.6px)",
  ]);

  if (section.id === "socials") {
    return (
      <footer id={section.id} className="scroll-mt-8 py-10 sm:py-14">
        <motion.div
          className="mx-auto w-full max-w-6xl text-center md:text-left"
          style={{ opacity: bodyOpacity }}
        >
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">
            {String(index + 1).padStart(2, "0")} / {section.label}
          </p>
          <SiteFooter />
        </motion.div>
      </footer>
    );
  }

  return (
    <section
      id={section.id}
      className="relative grid min-h-screen scroll-mt-8 place-items-center py-24"
    >
      <motion.div
        className={[
          "w-full max-w-6xl text-center will-change-transform md:text-left",
          section.id === "socials" ? "w-full" : "",
        ].join(" ")}
        style={{ opacity, scale, y, filter: blur }}
      >
        <motion.p
          className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6a44]"
          style={{ x: eyebrowX }}
        >
          {String(index + 1).padStart(2, "0")} / {section.label}
        </motion.p>
        <motion.h1
          className="text-5xl tracking-normal sm:text-7xl"
          style={{ fontWeight: titleWeight }}
        >
          {copy.title}
        </motion.h1>
        <motion.div
          className={[
            "mx-auto mt-7 w-full text-lg leading-8 text-[#625a50] md:mx-0",
            section.id === "home" ? "max-w-[68rem]" : "max-w-none",
          ].join(" ")}
          style={{ opacity: bodyOpacity }}
        >
          {copy.body}
        </motion.div>
      </motion.div>
      {section.id === "home" ? (
        <motion.div
          className="absolute bottom-16 left-1/2 grid w-full max-w-5xl -translate-x-1/2 grid-cols-3 gap-3 px-5 sm:bottom-20 sm:gap-7"
          style={{ opacity: bodyOpacity }}
        >
          {mediaItems.map((item) => (
            <MediaCard item={item} key={item.title} />
          ))}
        </motion.div>
      ) : null}
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

  useEffect(() => {
    const updateFromHash = () => {
      const hashId = window.location.hash.replace("#", "");
      const hashIndex = sections.findIndex((section) => section.id === hashId);

      if (hashIndex >= 0) {
        setActiveId(sections[hashIndex].id);
      }
    };

    updateFromHash();
    const firstFrame = window.setTimeout(updateFromHash, 0);
    const settledFrame = window.setTimeout(updateFromHash, 250);
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.clearTimeout(firstFrame);
      window.clearTimeout(settledFrame);
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [sections]);

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
        <a href="#home" className="text-xs font-semibold tracking-[0.18em]">
          SCOTT
        </a>
        <div className="flex gap-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                activeId === section.id ? "bg-[#1d1a16]" : "bg-[#c8bdad]",
              ].join(" ")}
              aria-label={`Go to ${section.label}`}
            />
          ))}
        </div>
      </nav>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:ml-60">
        {sections.map((section, index) => (
          <ContentSection
            key={section.id}
            section={section}
            index={index}
            smoothSectionProgress={smoothSectionProgress}
          />
        ))}
      </div>
    </main>
  );
}
