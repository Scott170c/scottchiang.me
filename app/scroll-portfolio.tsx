"use client";

import {
  type CSSProperties,
  type ReactNode,
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
  rotation?: string;
};

type ProjectItem = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  status: string;
  accent: string;
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
    rotation: "-2.5deg",
  },
  {
    title: "VIA Rail x Hack Club Hackathon",
    eyebrow: "Article",
    description: "VIA Rail press release about Hack Club's Boreal Express journey.",
    href: "https://media.viarail.ca/en/press-releases/2024/50-young-hack-club-coders-champion-sustainable-future-rails-canadian",
    imageSrc: "/the-canadian.jpg",
    imageAlt: "The Canadian train traveling through mountain scenery",
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

const projectItems: ProjectItem[] = [
  {
    title: "Project Placeholder",
    description:
      "Short placeholder copy for a featured build. Use this space for a concise summary of the problem, what you made, and the outcome.",
    href: "#",
    tags: ["Robotics", "Controls", "Hardware"],
    status: "project",
    accent: "#70756d",
    imageSrc: "https://picsum.photos/seed/robotics-lab/1200/760",
    imageAlt: "High quality robotics lab placeholder image",
  },
  {
    title: "Project Placeholder",
    description:
      "Short placeholder copy for a case study. Keep the description direct, readable, and focused on what the project demonstrates.",
    href: "#",
    tags: ["Data Science", "Visualization", "Hackathon"],
    status: "project",
    accent: "#587274",
    imageSrc: "https://picsum.photos/seed/rail-data/1200/760",
    imageAlt: "High quality transportation data placeholder image",
  },
  {
    title: "Project Placeholder",
    description:
      "Short placeholder copy for another selected project. Add context, tools, and a result once the final project details are ready.",
    href: repoHref,
    tags: ["Next.js", "Tailwind", "Animation"],
    status: "project",
    accent: "#26231f",
    imageSrc: "https://picsum.photos/seed/interface-system/1200/760",
    imageAlt: "High quality interface design placeholder image",
  },
];

const techStack = {
  languages: [
    { label: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { label: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { label: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  ],
  tools: [
    { label: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { label: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { label: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { label: "Arduino", icon: "https://cdn.simpleicons.org/arduino/00878F" },
    { label: "Raspberry Pi", icon: "https://cdn.simpleicons.org/raspberrypi/A22846" },
    { label: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  ],
};

const techStackItems = [...techStack.languages, ...techStack.tools];

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
    body: <h4 style={{ fontSize: "1.3rem", fontWeight: 500 }}>I graduated high school early, now I'm a <b>Robotics Engineering Intern @ RobotX ∪ Data Science Transfer Student @ IVC</b> </h4>
  },
  projects: {
    title: "Projects & Experience",
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
  "font-[Arial,Helvetica,sans-serif] font-bold uppercase tracking-[0.24em]";

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

function SiteFooter() {
  return (
    <div className="border-t border-[#ded8cc] py-8 text-sm text-[#756c61]">
      <div className="grid gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:items-start md:text-left">
        <div>
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("home");
            }}
            className={[
              "text-[#1d1a16]",
              sidebarTextClass,
            ].join(" ")}
          >
            SCOTT CHIANG
          </a>
          <p className="mt-4 max-w-sm leading-6">
            Student, Maker, and Robotics Enthusiast
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
            <p className="font-[var(--font-geist-mono)] text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8a6a44]">
              Connect
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {socialLinks.map(({ label, href, iconSrc, iconClassName }) => {
                const isEmail = href.startsWith("mailto:");

                return (
                  <a
                    key={label}
                    aria-label={label}
                    className="group grid h-14 w-14 place-items-center transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
                    href={href}
                    rel={isEmail ? undefined : "noreferrer"}
                    target={isEmail ? undefined : "_blank"}
                    title={label}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className={`${iconClassName ?? "h-10 w-10"} object-contain transition-transform duration-300 group-hover:scale-110`}
                      decoding="async"
                      loading="lazy"
                      src={iconSrc}
                    />
                  </a>
                );
              })}
            </div>
        </div>

        <div className="text-center md:text-right">
          <p>&copy; 2026 Scott Chiang.</p>
          <div className="mt-1 flex flex-col items-center gap-1 md:items-end">
            <a
              className="inline-block font-semibold text-[#1d1a16] underline decoration-[#cfc6b8] decoration-1 underline-offset-4 transition hover:decoration-[#1d1a16]"
              href={repoHref}
              rel="noreferrer"
              target="_blank"
            >
              View repository
            </a>
            <a
              className="inline-block font-semibold text-[#1d1a16] underline decoration-[#cfc6b8] decoration-1 underline-offset-4 transition hover:decoration-[#1d1a16]"
              href="/resume.pdf"
              target="_blank"
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      <div
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
      className="group relative block aspect-[4/3] w-full max-w-72 rotate-[var(--card-rotation)] overflow-hidden rounded-lg border border-[#f3eee7] bg-[#fffdfa] p-0.5 text-left shadow-[0_14px_32px_rgba(29,26,22,0.03)] transition duration-300 ease-out hover:-translate-y-2 hover:rotate-0 hover:border-[#ebe4da] hover:shadow-[0_20px_40px_rgba(29,26,22,0.05)] focus:outline-none"
      href={item.href}
      rel={item.href.startsWith("#") ? undefined : "noreferrer"}
      style={cardStyle}
      target={item.href.startsWith("#") ? undefined : "_blank"}
      title={item.description}
    >
      <div className="relative h-full overflow-hidden rounded-md bg-[#fbfaf7] [clip-path:inset(0_round_0.375rem)]">
        {hasImage ? (
          <img
            alt={item.imageAlt ?? item.title}
            className="block h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            decoding="async"
            loading="lazy"
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
        <div className="absolute inset-x-0 bottom-0 bg-white/86 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-full">
          <p className="font-[var(--font-geist-mono)] text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a6a44]">
            {item.eyebrow}
          </p>
          <h2 className="truncate text-base font-semibold text-[#1d1a16]">{item.title}</h2>
        </div>
      </div>
    </a>
  );
}

function ProjectCard({
  project,
}: {
  project: ProjectItem;
}) {
  const isPlaceholder = project.href === "#";
  const hasImage = Boolean(project.imageSrc);

  return (
    <a
      className="group block text-left transition duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1d1a16]/20"
      href={project.href}
      rel={isPlaceholder ? undefined : "noreferrer"}
      target={isPlaceholder ? undefined : "_blank"}
    >
      <div className="h-full rounded-lg border border-[#eee8de] bg-[#fffdfa] p-1.5 shadow-[0_14px_38px_rgba(29,26,22,0.035)] transition duration-300 group-hover:border-[#ded8cc] group-hover:shadow-[0_20px_46px_rgba(29,26,22,0.06)]">
        <div className="relative aspect-video overflow-hidden rounded-md bg-[#f8f5ee] shadow-[0_12px_34px_rgba(29,26,22,0.035)]">
          {hasImage ? (
            <img
              alt={project.imageAlt ?? project.title}
              className="h-full w-full object-cover grayscale-[8%] transition duration-300 group-hover:scale-[1.01] group-hover:grayscale-0"
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

        <div className="pt-2.5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[1rem] font-medium leading-tight text-[#1d1a16]">
              {project.title}
            </h2>
            <p className="shrink-0 pr-1 pt-0.5 text-right text-[0.72rem] font-normal lowercase tracking-normal text-[#756c61]">
              {project.status}
            </p>
          </div>
          <p className="mt-2 min-h-[4.25rem] text-[0.76rem] leading-[1.25rem] text-[#625a50]">
            {project.description}
          </p>
        </div>
      </div>
    </a>
  );
}

function TechStackStrip() {
  return (
    <div className="mt-8 max-w-5xl rounded-lg border border-[#eee8de] bg-[#fffdfa] p-4 shadow-[0_14px_38px_rgba(29,26,22,0.025)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <p className="w-28 shrink-0 font-[var(--font-geist-mono)] text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8a6a44]">
          Tech stack
        </p>
        <div className="flex flex-wrap gap-2">
          {techStackItems.map((tool) => (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3eb] px-3 py-1 font-[var(--font-geist-mono)] text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#625a50]"
              key={tool.label}
            >
              <img
                alt=""
                aria-hidden="true"
                className="h-3.5 w-3.5 object-contain"
                decoding="async"
                loading="lazy"
                src={tool.icon}
              />
              {tool.label}
            </span>
          ))}
        </div>
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
    return (
      <footer id={section.id} className="scroll-mt-8 py-10 sm:py-14">
        <div
          className="mx-auto w-full max-w-6xl text-center md:text-left"
        >
          <SiteFooter />
        </div>
      </footer>
    );
  }

  return (
    <section
      id={section.id}
      className={[
        "relative grid min-h-screen scroll-mt-8 py-24",
        section.id === "home" ? "place-items-start pb-36 sm:py-32 sm:pb-44" : "place-items-center",
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
          {String(index + 1).padStart(2, "0")} / {section.label}
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
            className="mx-auto mt-10 grid w-full max-w-xs grid-cols-1 gap-4 overflow-visible px-2 py-4 sm:hidden"
          >
            {mediaItems.map((item) => (
              <MediaCard item={item} key={item.title} />
            ))}
          </div>
        ) : null}
        {section.id === "projects" ? (
          <div className="mt-10 md:pl-6 lg:pl-8">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 md:mx-0">
              {projectItems.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                />
              ))}
            </div>
            <TechStackStrip />
          </div>
        ) : null}
      </div>
      {section.id === "home" ? (
        <div
          className="absolute bottom-12 left-1/2 hidden w-full max-w-5xl -translate-x-1/2 grid-cols-3 gap-7 overflow-visible px-8 py-10 sm:grid lg:px-12"
        >
          {mediaItems.map((item) => (
            <MediaCard item={item} key={item.title} />
          ))}
        </div>
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
