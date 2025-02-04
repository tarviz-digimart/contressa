"use client";
import AboutSection from "@/components/level-2/Profile/AboutSection";
import WorkedOn from "@/components/level-2/Profile/Projects";
import WorkedIn from "@/components/level-2/Profile/Activities";

export default function Home() {
  return (
    <div className="flex justify-center py-10 px-4 text-black">
      <div className="flex flex-col md:flex-row w-full max-w-6xl">
        {/* Sidebar */}

        <div className="p-6 flex flex-col items-center">
          <AboutSection />
        </div>

        {/* Main Content */}
        <div>
          {/* Worked on Section */}
          <WorkedOn />

          {/* Works With */}

          <WorkedIn />
        </div>
      </div>
    </div>
  );
}
