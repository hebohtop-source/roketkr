import { CarouselItem } from "@/components/ui/carousel";
import { CarouselShell } from "./CarouselShell";
import { ReactNode } from "react";

type CarouselSectionProps<T extends { id: string | number }> = {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  basis?: string;
  headerExtra?: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function CarouselSection<T extends { id: string | number }>({
  title,
  items,
  renderItem,
  headerExtra,
  orientation,
  basis = "basis-4/5 sm:basis-1/2 lg:basis-1/4",
  className,
}: CarouselSectionProps<T>) {
  return (
    <CarouselShell
      orientation={orientation}
      title={title}
      headerExtra={headerExtra}
      className={className}
    >
      {items.map((item) => (
        <CarouselItem key={item.id} className={basis}>
          {renderItem(item)}
        </CarouselItem>
      ))}
    </CarouselShell>
  );
}
