const Database = require("./database/db");

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require("./utils/format");

//render index
function pageLanding(request, response) {
  // return response.sendFile(__dirname + "/views/index.html");
  return response.render("index.html");
}

//render study
async function pageStudy(request, response) {
  // return response.sendFile(__dirname + "/views/study.html");
  const filters = request.query;

  //check if any filter is empty
  if (!filters.subject || !filters.weekday || !filters.time) {
    return response.render("study.html", { filters, subjects, weekdays });
  }

  // console.log("não tem campos vazios");

  //converting hours to minutes
  const timeToMinutes = convertHoursToMinutes(filters.time);

  const query = `
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes on (classes.proffy_id = proffys.id)
    WHERE EXISTS (
          select class_schedule.*
          from class_schedule
          where class_schedule.class_id = classes.id
            and class_schedule.weekday = ${filters.weekday}
            and class_schedule.time_from <= ${timeToMinutes}
            and class_schedule.time_to > ${timeToMinutes}
    )
    AND classes.subject = '${filters.subject}'
  `;

  //in case of any error when retrieving data from database
  try {
    const db = await Database;
    const proffys = await db.all(query);

    proffys.map((proffy) => {
      proffy.subject = getSubject(proffy.subject);
    });

    return response.render("study.html", { proffys, subjects, filters, weekdays });
  } catch (error) {
    console.log(error);
  }
}

//render give-classes
function pageGiveClasses(request, response) {
  // const data = request.body;

  // // if we have data
  // const isNotEmpty = Object.keys(data).length > 0;
  // if (isNotEmpty) {
  //   data.subject = getSubject(data.subject);

  //   //then, add into proffy list
  //   proffys.push(data);

  //   //redirect to study
  //   return response.redirect("/study");
  // }

  // return response.sendFile(__dirname + "/views/give-classes.html");

  //else, display give-classes
  return response.render("give-classes.html", {
    subjects,
    weekdays,
  });
}

async function saveClasses(request, response) {
  const createProffy = require("./database/createProffy");

  const data = request.body;

  const proffyValue = {
    name: request.body.name,
    avatar: request.body.avatar,
    whatsapp: request.body.whatsapp,
    bio: request.body.bio,
  };

  const classValue = {
    subject: request.body.subject,
    cost: request.body.cost,
  };

  const classScheduleValues = request.body.weekday.map((weekday, index) => {
    return {
      weekday: weekday,
      time_from: convertHoursToMinutes(request.body.time_from[index]),
      time_to: convertHoursToMinutes(request.body.time_to[index]),
    };
  });

  try {
    const db = await Database;
    await createProffy(db, { proffyValue, classValue, classScheduleValues });

    let queryString = "?subject=" + request.body.subject;
    queryString += "&weekday=" + request.body.weekday[0];
    queryString += "&time=" + request.body.time_from[0];

    return response.redirect("/study" + queryString);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
};
