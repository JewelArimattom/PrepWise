import Image from "next/image";

import { cn, getTechLogos } from "@/lib/utils";

// Define the component's props interface
interface TechIconProps {
  techStack?: string[]; // Make the prop optional
}

const DisplayTechIcons = async ({ techStack = [] }: TechIconProps) => {
  // techStack now defaults to [] if it's not provided
  const techIcons = await getTechLogos(techStack);

  // Return null or an empty fragment if there are no icons to display
  if (!techIcons || techIcons.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex items-center justify-center", // Used flexbox alignment helpers
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={20} // Adjusted size for clarity
            height={20}
            className="size-5 object-contain" // Added object-contain
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;