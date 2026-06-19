import { ScrollPortfolio } from "./scroll-portfolio";

const sections = [
  {
    id: "home",
    label: "About Me",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "socials",
    label: "Contact",
  },
];

export default function Home() {
  return <ScrollPortfolio sections={sections} />;
}
