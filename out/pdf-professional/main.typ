#let formatText(text) = {
  // Replace all <br /> with new line
  // text.replace(regex("<br />"), "\n")
  // // Replace all [Text](https://www.link.com) with link
  // .replace(regex("\\[(.*)\\]\\((.*)\\)"), (occur) => {
  //   let text = occur.captures.at(0)
  //   let url = occur.captures.at(1)
  //   link(url)[text]
  // })
    
}
  


#let data = json("../../in/data.json")

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
