import fs from "fs";
import path from "path";
import { getBadge } from "./badges";

interface ResumeData {
    avatar: string;
    preName: string;
    lastName: string;
    telephone: string;
    email: string;
    cityAndCountry: string;
    github: string;
    linkedin: string;
    website: string;
    objective: string;
    education: Array<{
        degree: string;
        fieldOfStudy: string;
        university: string;
        cityAndCountry: string;
        from: string;
        to: string;
        expected?: string;
        gradePointAverage: string;
        thesis?: string;
        thesisGrade?: string;
    }>;
    skills: Array<{
        field: string;
        entities: string[];
    }>;
    experience: Array<{
        position: string;
        company: string;
        cityAndCountry: string;
        from: string;
        to: string;
        infos: string[];
    }>;
    projects: Array<{
        name: string;
        description: string;
        image?: string;
        github?: string;
        demo?: string;
    }>;
    projectsToShowInProfessionalResume: number[];
    extracurricularActivities: string[];
    impressum: string;
    newPageBefore: string[];
    domain: string;
}

function cleanMarkdownLinks(text: string): string {
    // Convert markdown links to plain text for GitHub README
    return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function createSkillBadges(skills: string[]): string {

    // check how many skills are available as badges and
    // if it is more than half of them render all as badges (custom badges for not available skills)
    // if it is less than half, render all as bullet points
    const availableBadges = skills.map(skill => getBadge(skill.trim())).filter(badge => badge !== null && badge !== undefined);
    const threshold = Math.ceil(skills.length / 2);
    if (availableBadges.length >= threshold) {
        return skills.map(skill => {
            const cleanSkill = skill.trim();
            const badgeUrl = getBadge(cleanSkill);
            if (badgeUrl) {
                return `![${cleanSkill}](${badgeUrl})`;
            } else {
                // Fallback badge for skills not in the map
                return `![${cleanSkill}](https://img.shields.io/badge/${encodeURIComponent(cleanSkill)}-lightgrey)`;
            }
        }).join('\n');
    }
    else {
        return skills.map(skill => `- ${skill.trim()}`).join('\n');
    }
}

function generateReadme(resumeData: ResumeData): string {
    const fullName = `${resumeData.preName} ${resumeData.lastName}`;
    const avatarPath = `./img/${resumeData.avatar}`;
    const githubUrl = resumeData.github.startsWith('http') ? resumeData.github : `https://${resumeData.github}`;
    const linkedinUrl = resumeData.linkedin.startsWith('http') ? resumeData.linkedin : `https://${resumeData.linkedin}`;
    const websiteUrl = resumeData.website.startsWith('http') ? resumeData.website : `https://${resumeData.website}`;
    const readme = `
<div align="center">
  <img src="${avatarPath}" alt="${fullName}" width="200" height="200" style="border-radius: 50%;" />
  
  # Hi there, I'm ${fullName} 👋

<div style="display: flex; flex-direction: column">

  [![GitHub](https://custom-icon-badges.demolab.com/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](${githubUrl})
  [![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin-white&logoColor=white)](${linkedinUrl})
  [![Website](https://custom-icon-badges.demolab.com/badge/Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](${websiteUrl})
  [![Email](https://custom-icon-badges.demolab.com/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${resumeData.email})

</div>

  📍 ${resumeData.cityAndCountry}
</div>

---

## 🚀 About Me

${cleanMarkdownLinks(resumeData.objective).replace(/<br\s*\/?>/g, '\n\n')}

## 🛠️ Skills

${resumeData.skills.map(skill => `
### ${skill.field}
${createSkillBadges(skill.entities)}
`).join('\n')}

## 🎓 Education

| Degree | University | Location | Period | GPA | Thesis |
|--------|------------|----------|--------|-----|--------|
${resumeData.education.map(edu => {
        const period = `${edu.from} - ${edu.to}${edu.expected ? ` (Expected: ${edu.expected})` : ''}`;
        const thesis = edu.thesis ? `"${edu.thesis}" (${edu.thesisGrade})` : '-';
        return `| ${edu.degree} in ${edu.fieldOfStudy} | ${edu.university} | ${edu.cityAndCountry} | ${period} | ${edu.gradePointAverage} | ${thesis} |`;
    }).join('\n')}

## 💼 Professional Experience

| Position | Company | Location | Period | Infos |
|----------|---------|----------|--------|---------------------|
${resumeData.experience.map(exp => {
        const period = `${exp.from} - ${exp.to}`;
        const responsibilities = exp.infos.map(info => cleanMarkdownLinks(info)).join('<br>• ');
        return `| ${exp.position} | ${cleanMarkdownLinks(exp.company)} | ${exp.cityAndCountry} | ${period} | • ${responsibilities} |`;
    }).join('\n')}

## 🚀 Featured Projects

<div align="center">

${resumeData.projects
            .filter((_, index) => resumeData.projectsToShowInProfessionalResume.includes(index))
            .map((project, index) => {
                const imageSection = project.image
                    ? `<img src="./img/${project.image}" alt="${project.name}" width="600" style="border-radius: 10px; margin: 20px 0;" />`
                    : '';
                const githubBadge = project.github
                    ? `[![GitHub](https://custom-icon-badges.demolab.com/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://${project.github})`
                    : '';
                const demoBadge = project.demo
                    ? `[![Demo](https://custom-icon-badges.demolab.com/badge/Live_Demo-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://${project.demo})`
                    : '';
                const badges = [githubBadge, demoBadge].filter(badge => badge).join('&nbsp;&nbsp;');
                const separator = index < resumeData.projects.filter((_, i) => resumeData.projectsToShowInProfessionalResume.includes(i)).length - 1
                    ? '\n\n---\n'
                    : '';

                return `
### ${project.name}

<p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">${project.description}</p>

${imageSection}


${badges}
${separator}

`;
            }).join('\n')}

</div>

## 🎯 Interests & Activities

${resumeData.extracurricularActivities.map(activity => `- ${activity}`).join('\n')}


## 📊 GitHub Stats

<div align="center">
  
  
  ![GitHub stats](https://github-readme-stats.vercel.app/api?username=${resumeData.github.split('/').pop()}&show_icons=true&theme=tokyonight)
  
  ![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${resumeData.github.split('/').pop()}&layout=compact&theme=tokyonight)
  
  ![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${resumeData.github.split('/').pop()}&theme=tokyonight)
  
</div>
    
`.trim();
    return readme;
}

function main() {
    console.log("🚀 Generating GitHub README...");

    try {
        // Load the resume data - handle both dev and build modes
        let dataPath: string;
        let imgPath: string;
        if (__dirname.includes('build')) {
            // Running from build directory
            dataPath = path.join(__dirname, "../../../in/data.json");
            imgPath = path.join(__dirname, "../../../in/img");
        } else {
            // Running from source directory
            dataPath = path.join(__dirname, "../../in/data.json");
            imgPath = path.join(__dirname, "../../in/img");
        }

        const dataContent = fs.readFileSync(dataPath, 'utf8');
        const resumeData = JSON.parse(dataContent) as ResumeData;

        // copy all the img/ files to the gen/img/ directory
        const outputImgPath = path.join(__dirname, "./gen/img");
        if (!fs.existsSync(outputImgPath)) {
            fs.mkdirSync(outputImgPath, { recursive: true });
        }
        const imgFiles = fs.readdirSync(imgPath);
        imgFiles.forEach(file => {
            const srcFile = path.join(imgPath, file);
            const destFile = path.join(outputImgPath, file);
            fs.copyFileSync(srcFile, destFile);
        });

        const readme = generateReadme(resumeData);

        // Write the README to the output directory
        const outputPath = __dirname.includes('build')
            ? path.join(__dirname, "../gen/README.md")
            : path.join(__dirname, "./gen/README.md");
        fs.writeFileSync(outputPath, readme);

        console.log("✅ GitHub README generated successfully!");
        console.log("📝 Files created:");
        console.log("   - out/github-readme/gen/README.md");

    } catch (error) {
        console.error("❌ Error generating README:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export { generateReadme };
