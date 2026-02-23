import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { learningResources } from "@/lib/data";
import { BookOpen, Lightbulb } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Learning Hub</h1>
          <p className="text-muted-foreground">Understand the "why" behind your actions.</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {learningResources.map(resource => (
          <AccordionItem value={resource.id} key={resource.id}>
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                {resource.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-10 pr-2">
              {resource.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
