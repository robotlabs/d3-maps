export const parser = (resultsAll) => {
  return new Promise((resolve, reject) => {
    let cities = {};
    let years = {};
    // cities.years = {};
    let max = {};
    for (let city in resultsAll) {
      cities[city] = {};
      let cityObj = resultsAll[city];
      for (let cat in cityObj) {
        let catObj = cityObj[cat];
        if (!max[cat]) {
          max[cat] = 0;
        }
        for (let year in catObj) {
          let yearObj = catObj[year];
          if (!cities[city][year]) {
            cities[city][year] = {};
          }
          if (!years[year]) {
            years[year] = {};
          }
          if (!years[year][city]) {
            years[year][city] = {};
          }
          if (cat === 'average-price-x-night') {
            yearObj = yearObj.substring(3, yearObj.length);
          }

          let value = Number(yearObj);
          cities[city][year][cat] = value;
          years[year][city][cat] = value;
          if (value > max[cat]) {
            max[cat] = value;
          }
        }
      }
    }
    convertToArray(cities);
    convertToArray(years);
    let resultsDeploy = {
      cities: cities,
      years: years,
      max: max
    };
    resolve(resultsDeploy);
  });
};

const convertToArray = (cities) => {
  let arr = [];
  var i = 0;
  for (let city in cities) {
    i++;
    var cityObj = cities[city];
    var newCityObj = [];

    for (let year in cityObj) {
      let yearObj = cityObj[year];
      let yyt = {
        year: year,
        arrCat: []
      };
      for (let cat in yearObj) {
        let catObj = {
          name: cat,
          value: yearObj[cat]
        };
        yyt.arrCat.push(catObj);
      }
      newCityObj.push(yyt);
    }
    cityObj.arr = newCityObj;

    // for (let y in c) {
    //   let yyt = {
    //     year: y,
    //     arrCat: []
    //   };
    //   for (let cat in y) {
    //
    //     let catObj = {
    //       name: cat,
    //       value: y[cat]
    //     };
    //     yyt.arrCat.push(catObj);
    //   }
    //   arr.push(yyt);
    // }
  }
  return arr;
};
const nester = (r, nestKey, createDictYes, dict) => {
  let resultsAge = d3.nest()
  .key(function(d) {
    return d[nestKey];
  })
  .rollup(function(d) {
    let pushId = [];
    for (let i = 0; i < d.length; i++) {
      if (createDictYes) {
        dict[d[i].id] = d[i];
      }
      pushId.push(d[i].id);
    }
    return pushId;
  })
  .entries(r);

  return resultsAge;
};
