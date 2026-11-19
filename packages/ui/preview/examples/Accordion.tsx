import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@porcelana/ui";

export default function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="repeat">
      <AccordionItem value="repeat">
        <AccordionTrigger>Repeat on weekdays</AccordionTrigger>
        <AccordionContent>Mon–Fri at 06:00. Weekends stay quiet unless you add them.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="sound">
        <AccordionTrigger>Sound</AccordionTrigger>
        <AccordionContent>Morning chime, rising volume over 30 seconds.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
