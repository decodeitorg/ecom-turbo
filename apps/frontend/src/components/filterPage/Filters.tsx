// import { priceRange } from "const/price";
// import { Slider } from "@nextui-org/react";

// export default function Product() {
//     return <></>;
// }

// let queryParams = () => {
//     //..................................................
//     // Get the current URL and parse the query parameters
//     const url = new URL(window.location.href);
//     const searchParams = new URLSearchParams(url.search);

//     // Get the filter_price query parameter
//     const filterPrice = searchParams.get("filter_price");
//     let price = filterPrice
//         ? filterPrice.split("-").map((x) => parseInt(x))
//         : [priceRange.min, priceRange.max];
//     const stock = searchParams.get("stock");

//     return { filterPrice: price, stock };
// };

// let MainFilter = () => {
//     let { filterPrice, stock } = queryParams();

//     const handleChanges = (value: { type: string; value: any }) => {
//         const url = new URL(window.location.href);
//         switch (value.type) {
//             case "filter_price":
//                 url.searchParams.set("filter_price", value.value.join("-"));
//                 window.history.pushState(null, "", url.toString());
//                 window.location.reload();
//                 break;
//             case "stock":
//                 url.searchParams.set("stock", value.value);
//                 window.history.pushState(null, "", url.toString());
//                 window.location.reload();
//                 break;
//         }
//     };

//     return (
//         <div className=" flex w-full flex-col items-stretch justify-start gap-5">
//             {/* <!-- Price --> */}
//             <div className="w-full">
//                 <div className="mb-3 flex w-full items-center justify-between">
//                     <p className="text-2xl font-bold text-primary">Price</p>
//                     <p
//                         onClick={() => {
//                             const url = new URL(window.location.href);
//                             url.searchParams.delete("filter_price");
//                             window.location.href = url.toString();
//                         }}
//                     >
//                         Reset
//                     </p>
//                 </div>
//                 <Slider
//                     step={100}
//                     maxValue={300000}
//                     minValue={0}
//                     defaultValue={filterPrice}
//                     showSteps={true}
//                     showTooltip={true}
//                     showOutline={true}
//                     disableThumbScale={true}
//                     formatOptions={{ style: "currency", currency: "BDT" }}
//                     tooltipValueFormatOptions={{
//                         style: "currency",
//                         currency: "BDT",
//                         maximumFractionDigits: 0,
//                     }}
//                     classNames={{
//                         base: "max-w-md",
//                         filler: "bg-gradient-to-r from-primary to-secondary",
//                         labelWrapper: "mb-2",
//                         label: "font-medium text-default-700 text-medium",
//                         value: "font-medium text-default-500 text-small",
//                         thumb: [
//                             "transition-size",
//                             "bg-gradient-to-r from-to-secondary to-primary",
//                             "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
//                             "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
//                         ],
//                         step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
//                     }}
//                     tooltipProps={{
//                         offset: 10,
//                         placement: "bottom",
//                         classNames: {
//                             base: [
//                                 // arrow color
//                                 "before:bg-gradient-to-r before:from-to-secondary before:to-primary",
//                             ],
//                             content: [
//                                 "py-2 shadow-xl",
//                                 "text-white bg-gradient-to-r from-secondary to-primary",
//                             ],
//                         },
//                     }}
//                     onChangeEnd={(value: Array<number>) => {
//                         handleChanges({
//                             type: "filter_price",
//                             value: value,
//                         });
//                     }}
//                 />
//             </div>
//             {/* <!-- stock( instock outofstock) --> */}
//             <div className="w-full">
//                 <div className="flex w-full items-center justify-between">
//                     <p className="text-2xl font-bold text-primary">Stock</p>
//                     <p
//                         onClick={() => {
//                             const url = new URL(window.location.href);
//                             url.searchParams.delete("stock");
//                             window.location.href = url.toString();
//                             window.location.reload();
//                         }}
//                         className="cursor-pointer transition-all duration-300 ease-in-out hover:text-primary"
//                     >
//                         Reset
//                     </p>
//                 </div>
//                 <div className="flex w-full items-center justify-between py-2">
//                     <div className="flex items-center justify-start gap-2">
//                         <input
//                             checked={stock === "instock"}
//                             type="radio"
//                             name="stock"
//                             id="instock"
//                             className="relative aspect-square h-5 w-5 cursor-pointer !appearance-none rounded border border-primary bg-secondary !bg-none !text-transparent shadow-sm !outline-none !ring-0 !ring-offset-0 transition-all duration-300 ease-in-out after:absolute after:left-[50%] after:top-[40%] after:h-[53%] after:w-[35%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[25deg] after:border-b-[0.17em] after:border-r-[0.17em] after:border-b-white after:border-r-white after:opacity-0 after:drop-shadow-[1px_0.5px_1px_rgba(56,149,248,0.5)] after:transition-all after:duration-200 after:ease-linear checked:!border-sky-400 checked:!bg-gradient-to-tr checked:!from-primary checked:!to-white checked:after:rotate-45 checked:after:opacity-100 hover:!border-sky-400 focus-visible:border-sky-400 focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-sky-400/30"
//                             onChange={() => {
//                                 handleChanges({
//                                     type: "stock",
//                                     value: "instock",
//                                 });
//                             }}
//                         />

//                         <label className="text-xl" htmlFor="instock">
//                             In Stock
//                         </label>
//                     </div>
//                     <p className="text-xl">10</p>
//                 </div>
//                 {/* <div className="w-full flex justify-between items-center py-2">
//                <div className="flex justify-start items-center gap-2">
//                   <input
//                      checked={stock === "outofstock"}
//                      type="radio"
//                      name="stock"
//                      id="outofstock"
//                      className="relative w-5 h-5 aspect-square !appearance-none !bg-none checked:!bg-gradient-to-tr checked:!from-primary checked:!to-white bg-secondary border border-primary shadow-sm rounded !outline-none !ring-0 !text-transparent !ring-offset-0 checked:!border-sky-400 hover:!border-sky-400 cursor-pointer transition-all duration-300 ease-in-out focus-visible:!outline-offset-2 focus-visible:!outline-2 focus-visible:!outline-sky-400/30 focus-visible:border-sky-400 after:w-[35%] after:h-[53%] after:absolute after:opacity-0 after:top-[40%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[25deg] after:drop-shadow-[1px_0.5px_1px_rgba(56,149,248,0.5)] after:border-r-[0.17em] after:border-r-white after:border-b-[0.17em] after:border-b-white after:transition-all after:duration-200 after:ease-linear checked:after:opacity-100 checked:after:rotate-45"
//                      onChange={() => {
//                         handleChanges({
//                            type: "stock",
//                            value: "outofstock",
//                         });
//                      }}
//                   />
//                   <label className="text-xl" htmlFor="outofstock">
//                      Upcoming
//                   </label>
//                </div>
//                <p className="text-xl">20</p>
//             </div> */}
//             </div>
//         </div>
//     );
// };
