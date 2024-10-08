
// FORMATTER FUNCTIONS
#let formatText(inputText) = {
  // Replace all <br /> with new line
  inputText = inputText.replace(regex("<br />"), "#v(0pt)")
  // Replace all [Text](https://www.link.com) with link
  inputText = inputText.replace(regex("(?U)\[(.*)\]\((.*)\)"), (occur) => {
    let text = occur.captures.at(0)
    let url = occur.captures.at(1)
    "#link(\"" + url + "\")[" + text + "]"
  })
  eval(inputText, mode: "markup")
}


// DATA AND STYLE DEFINITIONS
#let data = json("../../in/data.json")
#import "@preview/oxifmt:0.2.1": strfmt
#show link: set text(fill: rgb(0, 0, 255))
#set align(center)
#set par(justify: true)
#let diamontSep = text($diamond$,
  size: 6pt,
  baseline: -2pt,
)
#show heading.where(level: "h1"): set text(size: 19pt)
#set page(
   margin: (x: 29pt, y: 29pt),
)

// CONTENT

= #upper(data.preName + " " + data.lastName)

#data.telephone #diamontSep #data.cityAndCountry
#v(-6pt)
#{
  let socialMedia = ()
  if (data.keys().contains("email")) {
    socialMedia.push(
      link("mailto:" + data.email)[#data.email]
    )
  }
  if (data.keys().contains("linkedin")) {
    socialMedia.push(
      link("https://www." + data.linkedin)[LinkedIn]
    )
  }
  if (data.keys().contains("github")) {
    socialMedia.push(
      link("https://www." + data.github)[GitHub]
    )
  }
  if (data.keys().contains("website")) {
    socialMedia.push(
      link("https://www." + data.website)[#data.website]
    )
  }
  if (socialMedia.len() > 0) {
    socialMedia.join([ #diamontSep ])
  }
}
#figure(
  box(
    clip: true,
    radius: 5pt,
  )[
    #image("../../in/img/" + data.avatar, width: 20%)
  ]
)

#set align(left)

#if (data.newPageBefore.contains("objective")) { pagebreak() }
== OBJECTIVE
#line(length: 100%)

#formatText(data.objective)

#if (data.newPageBefore.contains("education")) { pagebreak() }
== EDUCATION
#line(length: 100%)

#for eduEntry in data.education {
  text(eduEntry.degree + " in " + eduEntry.fieldOfStudy,
    weight: "bold"
  )

  h(1fr)

  if (eduEntry.keys().contains("expected")){
    text(eduEntry.from + " - Expected " + eduEntry.expected)
  } else {
    text(eduEntry.from + " - " + eduEntry.to)
  }
  
  linebreak()

  text(eduEntry.university)
  h(1fr)
  text(eduEntry.cityAndCountry, style: "italic")

  linebreak()
  
  if (eduEntry.keys().contains("gradePointAverage")){
    if (eduEntry.keys().contains("expected")) {
      text("Current ")
    }
    let usGPA = strfmt("{0:.1}", (5 - float(eduEntry.gradePointAverage)))
    text("Grade Point Average: ")
    text(eduEntry.gradePointAverage + " (DE) / " + usGPA + " (US-GPA)", weight: "bold")
    linebreak()
  }

  if (eduEntry.keys().contains("thesis")){
    text("Thesis: " + eduEntry.thesis, style: "italic")
    if (eduEntry.keys().contains("thesisGrade")){
      let usGPA = strfmt("{0:.1}", (5 - float(eduEntry.thesisGrade)))
      text(" (Grade: " + eduEntry.thesisGrade + " (DE) / " + usGPA + " (US-GPA))", style: "italic")
    }
  }
  v(2pt)
}

#if (data.newPageBefore.contains("skills")) { pagebreak() }
== SKILLS
#line(length: 100%)
#let skillTableContent = ()
#for skill in data.skills {
  skillTableContent.push([
    #text(skill.field, weight: "bold")
  ])
  skillTableContent.push([

    // if one skill has more then 80 characters, put every skill in a new line
    #if (skill.entities.any((entity) => entity.len() > 80)) {
      formatText(skill.entities.join(", #v(-4pt)"))
    } else {
      formatText(skill.entities.join(", "))
    }
  ])
}
#if (skillTableContent.len() > 0) {
  table(
    stroke: none,
    inset: 0pt,
    gutter: 1em,
    columns: (auto, 100fr),
    ..skillTableContent
  )
}

#if (data.newPageBefore.contains("experience")) { pagebreak() }
== EXPERIENCE
#line(length: 100%)

#for expEntry in data.experience {
  text(expEntry.position, weight: "bold")
  h(1fr)
  text(expEntry.from + " - " + expEntry.to)
  linebreak()
  formatText(expEntry.company)
  h(1fr)
  text(expEntry.cityAndCountry, style: "italic")
  linebreak()
  list(
    ..expEntry.infos.map((info) => {
      formatText(info)
    }),
    indent: 15pt
  )
  v(2pt)
}

#if (data.newPageBefore.contains("projects")) { pagebreak() }
== PROJECTS
#line(length: 100%)

#for i in data.projectsToShowInProfessionalResume {

  let project = data.projects.at(i)

  text(project.name + ": ", weight: "bold")
  text(formatText(project.description))

  if (project.keys().contains("github")){
    h(3pt)
    link("https://www." + project.github)[
      #box(
        fill: rgb("#52525221"),
        radius: 2pt,
        // inset: 1pt
        outset: (2pt),
      )[#text("GitHub")]
    ]
  }
  if (project.keys().contains("demo")){
    h(3pt)
    link("https://www." + project.demo)[
      #box(
        fill: rgb("#002aff20"),
        radius: 2pt,
        // inset: 1pt
        outset: (2pt),
      )[#text("Demo")]
    ]
  }

  v(2pt)
}

#if (data.newPageBefore.contains("extracurricularActivities")) { pagebreak() }
== EXTRA-CURRICULAR ACTIVITIES
#line(length: 100%)

#list(
  ..data.extracurricularActivities.map((activity) => {
    formatText(activity)
  }),
  indent: 15pt
)