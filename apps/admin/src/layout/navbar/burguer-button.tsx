import React from "react";
import { useSidebarContext } from "../layout-context";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const BurgerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <Button onClick={setCollapsed} variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};

export default BurgerButton;
