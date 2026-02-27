import React from 'react';
import Hero from '../../components/Hero';
import FeaturedOpportunities from '../../components/FeaturedOpportunities';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedOpportunities />
      {/* We will add more sections here: Competitions, etc. */}
    </div>
  );
};

export default Home;
