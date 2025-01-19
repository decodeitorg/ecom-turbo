import React from "react";
import { useFetchData } from "@/hooks/hook";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

export default function Filter({ getAllProducts }) {
  let [categories, getCategories] = useFetchData("/api/admin/categories");

  const handleSort = (value) => {
    getAllProducts({
      price: value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    let name = event.target.search.value;
    getAllProducts({
      search: name,
    });
  };

  return (
    <div>
      {/* TreeSelect component is commented out in the original code */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <Button
          variant="ghost"
          onClick={() =>
            getAllProducts({
              search: "",
              price: "",
            })
          }
          className="text-sm text-gray-500"
        >
          Clear All
        </Button>
      </div>
      <div className="mb-5 flex justify-end gap-3">
        <Select onValueChange={handleSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Price(Asc)</SelectItem>
            <SelectItem value="low">Price(Desc)</SelectItem>
          </SelectContent>
        </Select>
        <Form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Input name="search" placeholder="Search Products" />
            <ChevronRight className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          </div>
        </Form>
      </div>
    </div>
  );
}
