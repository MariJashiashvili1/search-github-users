import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    // here we say that if language is equals to null, then return total
    if (!language) return total;
    // if the property of the object doesn't exist, create one, else if the property is already in the object, then i want to add whatever count i have plus 1
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    }
    else {
      total[language] = {
        // if the language is there keep the same properties, copy the values using spread operator
        ...total[language],
        // overwrite the value property and in the value property first get me what is the current value plus 1
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count
      }
    }
    return total;
  }, {})

  // since i want to have object arrays, i have to use Object.values which is gonna get me only the values of the object . then we're making sorting to make sure that objects with the highest value is gonna be first
  const mostUsed = Object.values(languages).sort((a, b) => {
    // first is gonna be the highest value language
    return b.value - a.value;
    // we're using slice, because we don't want to show more than 5 different languages
  }).slice(0, 5);

  // most stars per language
  const mostPopular = Object.values(languages).sort((a, b) => {
    return b.stars - a.stars;
  }).map((item) => {
    return { ...item, value: item.stars }
  }).slice(0, 5);

  // stars, forks
  let { stars, forks } = repos.reduce((total, item) => {
    const { stargazers_count, name, forks } = item;
    total.stars[stargazers_count] = { label: name, value: stargazers_count }
    total.forks[forks] = { label: name, value: forks }
    return total;
  },
    {
      stars: {}, forks: {}
    }
  )
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  // console.log(languages);
  // STEP 2 - Chart Data
  const chartData = [
    {
      label: "HTML",
      value: "13"
    },
    {
      label: "CSS",
      value: "23"
    },
    {
      label: "Javascript",
      value: "80"
    },

  ];
  return <section className='section'>
    <Wrapper className='section-center'>
      <Pie3D data={mostUsed}></Pie3D>
      <Column3D data={stars}></Column3D>
      <Doughnut2D data={mostPopular}></Doughnut2D>
      <Bar3D data={forks}></Bar3D>
    </Wrapper>
  </section>
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
