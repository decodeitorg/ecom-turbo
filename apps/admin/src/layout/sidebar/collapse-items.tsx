import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useEffect, useState } from "react";
import { PiCaretDoubleUp } from "react-icons/pi";

import { SidebarItem } from "./sidebar-item";

interface Props {
  icon: React.ReactNode;
  title: string;
  items: { title: string; href: string; icon: React.ReactNode }[];
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  let [currentPath, setCurrentPath] = useState<string>("");
  let [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  React.useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    let curentPathExists = items.find((item) => item.href === currentPath);
    setSelectedKeys(curentPathExists ? [title] : []);
  }, [currentPath, title]);

  return (
    <div className="flex h-full cursor-pointer items-center gap-4">
      <Accordion selectedKeys={selectedKeys}>
        <AccordionItem
          onPress={() => {
            setSelectedKeys((prev) => (prev.includes(title) ? [] : [title]));
          }}
          key={title}
          indicator={
            <PiCaretDoubleUp size={16} color="#CCE4F7" weight="bold" />
          }
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-2",

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12">
            {items.map((item, index) => (
              <SidebarItem
                title={item.title}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
