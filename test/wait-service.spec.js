const app = require("../src/app");
const agent = supertest(app);

let db;
const location = {
  name: "Etobicoke General Hospital Drive-Thru – Humber Queen’s Plate Parking",
  address: "2 Janda Ct",
  address_link:
    "https://www.google.com/maps/place/2+Janda+Ct,+Etobicoke,+ON+M9W+0A4/@43.7230577,-79.6032094,17z/data=!3m1!4b1!4m5!3m4!1s0x882b3a4c47501695:0xa03984db7b4ebe84!8m2!3d43.7230577!4d-79.6010207?shorturl=1",
  link:
    "http://www.williamoslerhs.ca/patients-and-families/preparing-for-your-visit-or-stay/coronavirus-information-for-patients-families/assessment-centre-for-covid-19",
  hours: "7 days/week; 8 a.m. to 6 p.m.",
  age_restrictions: "No children under the age of 2 years",
  other_details: "None",
  region: 3,
  lat: "43.7230577",
  lng: "-79.6032094"
};

describe("Getting locations", () => {
  it("should return a list of locations and expected properties", async () => {
    await db.insert(location).into("locations");

    const res = await agent
      .get("/api/waits?hour=9&date=2020-09-22")
      .expect(200);
    const returnedLocations = JSON.parse(res.text);
    expect(returnedLocations).to.have.lengthOf(1);

    const firstLocation = returnedLocations[0];

    expect(firstLocation).to.include.keys([
      "name",
      "address",
      "address_link",
      "link",
      "hours",
      "age_restrictions",
      "other_details",
      "region",
      "avg_wait",
      "submissions"
    ]);
  });
});

describe("Wait times", () => {
  const date = "2020-09-22";
  const hour = "10";
  const wait_time1 = 120;
  const wait_time2 = 60;

  before(async () => {
    await db.raw("truncate table locations restart identity cascade");
    await db.raw("truncate table wait_times restart identity cascade");
    const returnedLocation = await db
      .insert(location)
      .into("locations")
      .returning("*");

    await db
      .insert({
        location_id: returnedLocation[0].id,
        wait: wait_time1,
        date: date,
        hour: hour
      })
      .into("wait_times");

    await db
      .insert({
        location_id: returnedLocation[0].id,
        wait: wait_time2,
        date: date,
        hour: hour
      })
      .into("wait_times");
  });

  it("should return the correct average wait time", async () => {
    const res = await agent
      .get(`/api/waits?hour=${hour}&date=${date}`)
      .expect(200);

    const firstLocation = JSON.parse(res.text)[0];
    expect(Number(firstLocation.avg_wait)).to.equal(
      (wait_time1 + wait_time2) / 2
    );
  });

  it("should return the correct number of submissions", async () => {
    const res = await agent
      .get(`/api/waits?hour=${hour}&date=${date}`)
      .expect(200);

    const firstLocation = JSON.parse(res.text)[0];
    expect(Number(firstLocation.submissions)).to.equal(2);
  });
});

before(() => {
  db = app.get("db");
});

after(async () => {
  await db.raw("truncate table locations restart identity cascade");
  await db.raw("truncate table wait_times restart identity cascade");
  return db.destroy();
});
