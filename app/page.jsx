'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import SpecialOffers from "@/components/SpecialOffers";
import NewArrivals from "@/components/NewArrivals";

const Home = () => {
  return (
    <div className="px-6 md:px-16 lg:px-32">
      <HeaderSlider />
      <HomeProducts />
      <SpecialOffers />
      <NewArrivals />
      <FeaturedProduct />
      <Banner />
    </div>
  );
};

export default Home;
