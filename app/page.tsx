import Hero from "@/components/Hero";
import MultiSectionForm from "@/components/MultiSectionForm";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto py-10">
        <MultiSectionForm />
      </div>
    </>
  );
}
