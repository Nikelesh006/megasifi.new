'use client'
import React, { useState, useEffect } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import SpecialOffers from "@/components/SpecialOffers";
import NewArrivals from "@/components/NewArrivals";
import LoadingPage from "@/components/LoadingPage";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoading =
      typeof window !== 'undefined' && window.__hasSeenLoading === true;

    if (hasSeenLoading) {
      setIsLoading(false);
    } else if (typeof window !== 'undefined') {
      window.__hasSeenLoading = true;
      setIsLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-32">
      <HeaderSlider />
      <HomeProducts category="Popular Products" />
      <SpecialOffers />
      <NewArrivals />
      <Banner />
    </div>
  );
};

export default Home;
