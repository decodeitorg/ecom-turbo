// import { useLState } from "@/hooks/hook.ts";
// import toastify from "@/utils/toast.ts";

// import { DatePicker, DateRangePicker } from "";

// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { set } from "mongoose";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// export default function FilterByDate({ getOrders }) {
//   let [date, setDate] = useLState("orderDate", "");
//   let [startDate, setStartDate] = useState(new Date());
//   let [endDate, setEndDate] = useState(new Date());

//   useEffect(() => {
//     switch (date) {
//       case "today":
//         getOrders({
//           date: "today",
//         });
//         break;
//       case "yesterday":
//         getOrders({
//           date: "yesterday",
//         });
//         break;
//       case "thisWeek":
//         getOrders({
//           date: "thisWeek",
//         });
//         break;
//       case "thisMonth":
//         getOrders({
//           date: "thisMonth",
//         });
//         break;
//       case "pickDate":
//         if (startDate.toString() !== "Invalid Date") {
//           getOrders({
//             date: "pickDate",
//             startDate: startDate.toISOString(),
//           });
//         } else {
//           toastify("Please select a valid date", {
//             type: "error",
//           });
//         }

//         break;
//       case "pickDateRange":
//         if (
//           startDate.toString() !== "Invalid Date" &&
//           endDate.toString() !== "Invalid Date"
//         ) {
//           getOrders({
//             date: "pickDateRange",
//             startDate: startDate.toISOString(),
//             endDate: endDate.toISOString(),
//           });
//         } else {
//           toastify("Please select a valid date", {
//             type: "error",
//           });
//         }
//         break;
//     }
//   }, [date, startDate]);

//   return (
//     <div>
//       <Card>
//         <CardHeader>
//           <div className="flex w-full justify-between">
//             <h4>Filter By Date</h4>
//             <button
//               onClick={() => {
//                 setDate("");
//                 getOrders({
//                   date: "",
//                 });
//               }}
//               className="text-sm text-gray-600"
//             >
//               Reset
//             </button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <RadioGroup
//             defaultValue="comfortable"
//             onChange={() => setDate(e.target.value)}
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="today" id="today" />
//               <Label htmlFor="today">Today</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="yesterday" id="yesterday" />
//               <Label htmlFor="yesterday">Yesterday</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="thisWeek" id="thisWeek" />
//               <Label htmlFor="thisWeek">This Week</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="thisMonth" id="thisMonth" />
//               <Label htmlFor="thisMonth">This Month</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="pickDate" id="pickDate" />
//               <Label htmlFor="pickDate">Pick Date</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="pickDateRange" id="pickDateRange" />
//               <Label htmlFor="pickDateRange">Pick Date Range</Label>
//             </div>
//           </RadioGroup>
//           <br />
//           {date === "pickDate" && (
//             <>
//               <DatePicker
//                 label="Pick Order Date"
//                 className="max-w-[284px]"
//                 onChange={(value) => {
//                   const date = new Date(value);
//                   if (!isNaN(date.getTime())) {
//                     setStartDate(date);
//                   } else {
//                     toastify("Please select a valid date", {
//                       type: "error",
//                     });
//                   }
//                 }}
//               />
//             </>
//           )}
//           {date === "pickDateRange" && (
//             <>
//               <DateRangePicker
//                 label="Stay duration"
//                 className="max-w-xs"
//                 onChange={(v) => {
//                   console.log(v);
//                   let startDate = new Date(v.start);
//                   let endDate = new Date(v.end);

//                   if (
//                     !isNaN(startDate.getTime()) &&
//                     !isNaN(endDate.getTime())
//                   ) {
//                     setStartDate(startDate);
//                     setEndDate(endDate);
//                   } else {
//                     toastify("Please select a valid date", {
//                       type: "error",
//                     });
//                   }
//                 }}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React from "react";

export default function FilterByDate() {
  return <div>NeedToCHange</div>;
}
