function auToKm(au) {
  const distInKm = au * 149600000;
  return distInKm;
}

function findDiameter(abMagnitude) {
  const diameterInKm = (1329 / Math.sqrt(0.15)) * (Math.pow(10, (-0.2 * abMagnitude)));
  console.log(diameterInKm);
  return diameterInKm;
}



function findMass(diameter) {
  //find how many cm are in km * 100000
  const radiusInCm = diameter * 100000 / 2;
  //find how many cm3 are in the asteroid (cm3 to fit in with the g/cm3 density for mass)
  const volume = (4 / 3) * (Math.PI * Math.pow(radiusInCm, 3));
  //convert back into kg by /1000 at average of 2g/cm3
  const massInKg = (volume * 2) / 1000;
  console.log(massInKg)
  return massInKg;
}

findMass(1);

function findKe(mass, velocity) {

  const kineticEnergy = 0.5 * mass * (velocity * velocity);
  console.log(kineticEnergy);
  return kineticEnergy;

}

const numKilotonsTnt = findKe(findMass(1), 8000) / (4.184 * Math.pow(10, 12));

console.log(numKilotonsTnt);

module.exports = {
  auToKm,
  findDiameter,
  findMass,
  findKe
};

// designation : 363505
//
// orbit_id : 262
//
// cd calender date: 2022-Jan-01 01:25
//
// dist : 0.157697639972094
//
// distance in KM : 23591567
//
// dist_min : 0.157696898442492
//
// dist_max : 0.157698381502098
//
// v_rel : 12.52 km/s
//
// v_inf : 12.5171811123797
//
// t_sigma_f : < 00:01
//
// h - absolute magnitude: 18.33