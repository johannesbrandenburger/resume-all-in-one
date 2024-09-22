
// FORMATTER FUNCTIONS
#let formatText(inputText) = {
  // Replace all <br /> with new line
  inputText = inputText.replace(regex("<br />"), "\n")
  // Replace all [Text](https://www.link.com) with link
  inputText = inputText.replace(regex("\\[(.*)\\]\\((.*)\\)"), (occur) => {
    let text = occur.captures.at(0)
    let url = occur.captures.at(1)
    "#link(\"" + url + "\")[" + text + "]"
  })
  eval("["+ inputText +"]")
}

// DATA AND STYLE DEFINITIONS
#let data = json("../../in/data.json")
#import "@preview/oxifmt:0.2.1": strfmt

// CONTENT

= #data.preName #data.lastName

#data.telephone $diamond$ #data.cityAndCountry
#link("mailto:" + data.email)[#data.email] $diamond$
#link("https://www." + data.linkedin)[LinkedIn] $diamond$
#link("https://www." + data.website)[#data.website] $diamond$

#figure(
  image("../web/public/" + data.avatar, width: 20%)
)

== Objective
#line(length: 100%)

#formatText(data.objective)

== Education
#line(length: 100%)

#for eduEntry in data.education {
  text(eduEntry.degree + " in " + eduEntry.fieldOfStudy,
    weight: 1000
  )
  linebreak()

  if (eduEntry.keys().contains("expected")){
    text(eduEntry.from + " - Expected " + eduEntry.expected)
  } else {
    text(eduEntry.from + " - " + eduEntry.to)
  }
  
  if (eduEntry.keys().contains("gradePointAverage")){
    linebreak()
    if (eduEntry.keys().contains("expected")) {
      text("Current ")
    }
    let usGPA = strfmt("{0:.1}", (5 - float(eduEntry.gradePointAverage)))
    text("Grade Point Average: ")
    text(eduEntry.gradePointAverage + " (DE) / " + usGPA + " (US-GPA)", weight: "bold")
  }

  if (eduEntry.keys().contains("thesis")){
    linebreak()
    text("Thesis: " + eduEntry.thesis, style: "italic")
    if (eduEntry.keys().contains("thesisGrade")){
      let usGPA = strfmt("{0:.1}", (5 - float(eduEntry.thesisGrade)))
      text(" (Grade: " + eduEntry.thesisGrade + " (DE) / " + usGPA + " (US-GPA))", style: "italic")
    }
  }

  linebreak()
  text(eduEntry.university)
  linebreak()
  text(eduEntry.cityAndCountry, style: "italic")
  linebreak()
}