import Hero from "@/components/Hero";
import MultiSectionForm from "@/components/MultiSectionForm";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
        <MultiSectionForm />
      </div>
    </>
  );
}
