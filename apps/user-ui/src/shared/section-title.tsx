'use client'
import TitleBorder from "./title-border";

export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="relative">
      <h1 className="md:text-3xl text-xl relative z-10 font-semibold">
        {title}
      </h1>
      <TitleBorder className="absolute mt-1 top-[46%]" />
    </div>
  );
};
