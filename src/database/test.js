const Database = require("./db.js");
const createProffy = require("./createProffy");

//arrow function
Database.then(async (db) => {
  //insert data
  proffyValue = {
    name: "Diego Fernandes",
    avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
    whatsapp: "999999999",
    bio:
      "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências.Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
  };

  classValue = {
    subject: 1,
    cost: "20",
  };

  classScheduleValues = [
    {
      weekday: 1,
      time_from: 720,
      time_to: 1220,
    },
    {
      weekday: 0,
      time_from: 520,
      time_to: 1220,
    },
  ];

  // await createProffy(db, { proffyValue, classValue, classScheduleValues });

  //check inserted data

  const selectedProffys = await db.all("SELECT * FROM proffys");
  // console.log(selectedProffys);

  const selectClassesAndProffys = await db.all(`
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes on (classes.proffy_id = proffys.id)
    WHERE classes.proffy_id = 1
  `);
  // console.log(selectClassesAndProffys);

  const selectedClassesSchedules = await db.all(`
    select class_schedule.*
    from class_schedule
    where class_schedule.class_id = 1
      and class_schedule.weekday = 1
      and class_schedule.time_from <= 60000
      and class_schedule.time_to > 70000
  `);
  console.log(selectedClassesSchedules);
});
