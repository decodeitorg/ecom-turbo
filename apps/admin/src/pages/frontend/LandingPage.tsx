import React from "react";
import UserReviePicturesGalary from "@/components/landingpage/UserReviePicturesGalary.tsx";
import { GiTatteredBanner } from "react-icons/gi";
import { LuGalleryHorizontal } from "react-icons/lu";
import { SiSnowpack } from "react-icons/si";

import CampaignImages from "../../components/landingpage/CampaignImages.tsx";
import FeatureBanner from "../../components/landingpage/FeatureBanner.tsx";
import HeroCarousel from "../../components/landingpage/HeroCarousel.tsx";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhyChooseUs from "@/components/landingpage/WhyChooseUs.tsx";
import Breadcamb from "@/layout/Breadcamb";
export default function App() {
  return (
    <>
      <Breadcamb items={[{ label: "Landing Page" }]} />

      <Tabs defaultValue="heroCarousel" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="heroCarousel">
            <div className="flex items-center space-x-2">
              <LuGalleryHorizontal />
              <span>Hero Carousel</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="campaignImages">
            <div className="flex items-center space-x-2">
              <SiSnowpack />
              <span>Campaign Images</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="featureBanner">
            <div className="flex items-center space-x-2">
              <GiTatteredBanner />
              <span>Feature Banner</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="customerReviewImages">
            <div className="flex items-center space-x-2">
              <SiSnowpack />
              <span>Customer Review Images</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="whyChooseUs">
            <div className="flex items-center space-x-2">
              <SiSnowpack />
              <span>Why Choose Us</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <br />
        <TabsContent value="heroCarousel">
          <HeroCarousel />
        </TabsContent>
        <TabsContent value="campaignImages">
          <CampaignImages />
        </TabsContent>
        <TabsContent value="featureBanner">
          <FeatureBanner />
        </TabsContent>
        <TabsContent value="customerReviewImages">
          <UserReviePicturesGalary />
        </TabsContent>
        <TabsContent value="whyChooseUs">
          <WhyChooseUs />
        </TabsContent>
      </Tabs>
    </>
  );
}
