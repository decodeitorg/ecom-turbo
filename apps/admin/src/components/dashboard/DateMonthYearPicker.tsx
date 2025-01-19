import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useStore } from "@nanostores/react";
import {
  $selectedDateType,
  $startDate,
  $endDate,
  $dashboardData,
} from "@/store/dashBoard";
import { Button } from "@/components/ui/button";

export default function DateMonthYearPicker() {
  const selectedDateType = useStore($selectedDateType);
  const startDate = useStore($startDate);
  const endDate = useStore($endDate);

  const setSelectedDateType = (dateType) => {
    $selectedDateType.set(dateType);
  };

  const handleMonthChange = (date) => {
    //set start date iso date of first day of month
    let newDate = new Date(date);
    newDate.setDate(1);
    $startDate.set(newDate);
    //set end date iso date of last day of month
    newDate = new Date(date);
    newDate.setDate(
      new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
    );
    $endDate.set(newDate);
  };

  const handleYearChange = (date) => {
    //set start date iso date of first day of year
    let newDate = new Date(date);
    newDate.setMonth(0);
    newDate.setDate(1);
    $startDate.set(newDate);
    //set end date iso date of last day of year
    newDate = new Date(date);
    newDate.setMonth(11);
    newDate.setDate(31);
    $endDate.set(newDate);
  };

  const handleStartDateChange = (date) => {
    $startDate.set(date);
  };
  const handleEndDateChange = (date) => {
    $endDate.set(date);
  };

  let ButtonText = "";
  if (selectedDateType === "month") {
    // add month_name-year
    ButtonText += " " + startDate.toLocaleString("default", { month: "long" });
    ButtonText += " " + startDate.getFullYear();
  }
  if (selectedDateType === "year") {
    // add just the year like Year 2021
    ButtonText += " Year " + startDate.getFullYear();
  }
  if (selectedDateType === "range") {
    // add start date
    ButtonText += " " + startDate.toLocaleDateString();
    // add end date
    ButtonText += " - " + endDate.toLocaleDateString();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{ButtonText}</Button>
      </PopoverTrigger>

      <PopoverContent className="">
        <Tabs
          aria-label="Select Date"
          defaultValue="month"
          onValueChange={(v) => {
            setSelectedDateType(v);
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="month">By Month</TabsTrigger>
            <TabsTrigger value="year">By Year</TabsTrigger>
            <TabsTrigger value="range">Pick Range</TabsTrigger>
          </TabsList>
          <TabsContent value="month" title="By Month" className="w-full">
            <DatePicker
              selected={startDate}
              onChange={handleMonthChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="p-2 border dark:bg-gray-800"
            />
          </TabsContent>
          <TabsContent value="year" title="By year">
            <DatePicker
              selected={startDate}
              onChange={handleYearChange}
              dateFormat="yyyy"
              showYearPicker
              className="p-2 border dark:bg-gray-800"
            />
          </TabsContent>
          <TabsContent value="range" title="Pick Range" className="w-full">
            <div className="flex flex-col items-start justify-between">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="p-2 border dark:bg-gray-800"
              />
              <br />
              <label>End Date</label>

              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                className="p-2 border dark:bg-gray-800"
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
