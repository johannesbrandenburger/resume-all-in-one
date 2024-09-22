import * as data from "../../../in/data.json";
type Data = typeof data;

const buildLatex = (data: Data) => {

    // replace markdown links "[text](link)" with latex links "\href{link}{text}
    const replaceMdWithLatexLinks = (text: string) => {
        let textWithLineBreaks = text.replace(/<br \/>/g, "\\\\");
        return textWithLineBreaks.replace(/\[(.*?)\]\((.*?)\)/g, "\\href{$2}{$1}");
    }
    
    let latex = `
    \\documentclass{resume}

    \\usepackage[left=0.4 in,top=0.4in,right=0.4 in,bottom=0.4in]{geometry}
    \\usepackage{tabularx}
    \\usepackage{graphicx}
    \\usepackage{float}
    \\usepackage[utf8]{inputenc}
    \\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
    \\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}

    `;

    latex += `
    \\name{${data.preName} ${data.lastName}}
    \\address{${data.telephone} \\\\ ${data.cityAndCountry}}
    `;
    if (data.email || data.linkedin || data.website || data.github) {

        latex += `\\address{`;
        if (data.email) latex += `\\href{mailto:${data.email}}{${data.email}} \\\\ `;
        if (data.linkedin) latex += `\\href{https://${data.linkedin}}{LinkedIn} \\\\ `;
        if (data.github) latex += `\\href{https://${data.github}}{GitHub} \\\\ `;
        if (data.website) latex += `\\href{https://${data.website}}{${data.website}} \\\\ `;
        latex = latex.slice(0, -4);
        latex += `}`;
    }

    latex += `
    \\begin{document}

    `;

    if (data.avatar) {
        latex += `
        \\begin{figure}[H]
        \\centering
        \\includegraphics[width=75px]{../web/public/${data.avatar}}
        \\end{figure}
        \\vspace{-2em}
        `;
    }

    latex += `

    \\begin{rSection}{OBJECTIVE}

    {${replaceMdWithLatexLinks(data.objective)}}

    \\end{rSection}
    `;

    if (data.newPageBefore.includes("education")) latex += `\\newpage`;
    latex += `
    \\begin{rSection}{Education}
    `;

    // iterate over the education array and add it to the latex string
    data.education.forEach((education) => {
        latex += `
        {\\bf ${education.degree} in ${education.fieldOfStudy}} \\hfill {${education.from} - ${education.expected ? "Expected " + education.expected : education.to}}\\\\
        ${education.university} \\hfill \\textit{${education.cityAndCountry}}\\\\
        `;
        if (education.gradePointAverage) {
            const de = education.gradePointAverage;
            const gpaUS = (5 - parseFloat(de)).toFixed(1).toString();
            // if education.expected -> add "Current" before the GPA
            if (education.expected) latex += `Current `;
            latex += `Grade Point Average: \\textbf{${education.gradePointAverage} (DE) / ${gpaUS} (US-GPA)}\\\\`;
        }
        // thesis, thesisGrade (in small and italic letters)
        if (education.thesis) {
            latex += `\\begin{small}\\textit{`;
            latex += `Thesis: ${replaceMdWithLatexLinks(education.thesis)}`;
            if (education.thesisGrade) {
                const de = education.thesisGrade;
                const gpaUS = (5 - parseFloat(de)).toFixed(1).toString();

                // if thesis title is over 50 characters, add a line break before the grade
                if (education.thesis.length > 50) latex += `\\\\`;
                latex += ` (${education.thesisGrade} (DE) / ${gpaUS} (US))`;
            }
            latex += `}\\end{small}\\\\`;
        }

        latex = latex.slice(0, -2);
        latex += `\n`;
    });

    latex += `
    \\end{rSection}
    `;
    if (data.newPageBefore.includes("skills")) latex += `\\newpage`;
    latex += `
    \\begin{rSection}{SKILLS}
    `;

    latex += `
    \\begin{tabularx}{\\linewidth}{@{}>{\\bfseries}l@{\\hspace{.5em}}X@{}}`
    
    // iterate over the skills array and add it to the latex string
    data.skills.forEach((skill) => {
        latex += `
        ${skill.field} & ${skill.entities.map((entity) => replaceMdWithLatexLinks(entity)).join(", ")} \\\\
        `;
    });

    latex += `
    \\end{tabularx}\\\\
    \\end{rSection}
    `;
    if (data.newPageBefore.includes("experience")) latex += `\\newpage`;
    latex += `
    \\begin{rSection}{EXPERIENCE}
    `;

    // iterate over the experience array and add it to the latex string
    data.experience.forEach((experience) => {
        latex += `
        \\textbf{${experience.position}} \\hfill ${experience.from} - ${experience.to}\\\\
        ${replaceMdWithLatexLinks(experience.company)} \\hfill \\textit{${experience.cityAndCountry}}
        \\begin{itemize}
        \\itemsep -3pt {} 
        ${experience.infos.map((info) => `\\item ${replaceMdWithLatexLinks(info)}`).join("\n")}
        \\end{itemize}
        `;
    });

    latex += `
    \\end{rSection}
    `;

    if (data.newPageBefore.includes("projects")) latex += `\\newpage`;
    latex += `
    \\begin{rSection}{PROJECTS}
    \\vspace{-1.25em}
    `;

    // iterate over the projects array and add it to the latex string
    data.projectsToShowInProfessionalResume.forEach((projectIndex) => {
        let project = null;
        try { project = data.projects[projectIndex] } catch (e) { } // catch wrong indices
        if (!project) return;
        latex += `
        \\item \\textbf{${replaceMdWithLatexLinks(project.name)}}. ${replaceMdWithLatexLinks(project.description)} ${project.github ? `\\href{https://${project.github}}{(GitHub)}` : ""} ${project.demo ? `\\href{https://${project.demo}}{(Demo)}` : ""}
        `;
    });

    latex += `
    \\end{rSection}
    `;
    if (data.newPageBefore.includes("extracurricularActivities")) latex += `\\newpage`;
    latex += `

    \\begin{rSection}{Extra-Curricular Activities}
    \\begin{itemize}
    ${data.extracurricularActivities.map((activity) => `\\item ${replaceMdWithLatexLinks(activity)}`).join("\n")}
    \\end{itemize}
    \\end{rSection}

    \\end{document}
    `;

    return latex;

}

// write it to a file (generated.tex)
import fs from "fs";
const latex = buildLatex(data);
fs.writeFileSync("generated.tex", latex);

// after 2 s copy the generated.pdf to the public folder of the web-resume project
setTimeout(() => {
    fs.cpSync("generated.pdf", `../web/public/resume-${data.preName.toLowerCase()}-${data.lastName.toLowerCase()}.pdf`);
}, 2000);