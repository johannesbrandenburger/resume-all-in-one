import fs from "fs";
import path from "path";

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

function createTechSkillBadges(skills: string[]): string {
    const badgeMap: { [key: string]: string } = {
        'Java': 'https://custom-icon-badges.demolab.com/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white',
        'TypeScript': 'https://custom-icon-badges.demolab.com/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
        'JavaScript': 'https://custom-icon-badges.demolab.com/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
        'Python': 'https://custom-icon-badges.demolab.com/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
        'C++': 'https://custom-icon-badges.demolab.com/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white',
        'Docker': 'https://custom-icon-badges.demolab.com/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white',
        'Kubernetes': 'https://custom-icon-badges.demolab.com/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white',
        'Azure': 'https://custom-icon-badges.demolab.com/badge/Microsoft_Azure-0089D0?style=for-the-badge&logo=microsoft-azure&logoColor=white',
        'AWS': 'https://custom-icon-badges.demolab.com/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white',
        'TensorFlow': 'https://custom-icon-badges.demolab.com/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white',
        'Quarkus': 'https://custom-icon-badges.demolab.com/badge/Quarkus-4695EB?style=for-the-badge&logo=quarkus&logoColor=white',
        'React': 'https://custom-icon-badges.demolab.com/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
        'Node.js': 'https://custom-icon-badges.demolab.com/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white',
        'Next.js': 'https://custom-icon-badges.demolab.com/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
        'Vue.js': 'https://custom-icon-badges.demolab.com/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D',
        'Angular': 'https://custom-icon-badges.demolab.com/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white',
        'Express': 'https://custom-icon-badges.demolab.com/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white',
        'MongoDB': 'https://custom-icon-badges.demolab.com/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white',
        'PostgreSQL': 'https://custom-icon-badges.demolab.com/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white',
        'MySQL': 'https://custom-icon-badges.demolab.com/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white',
        'Redis': 'https://custom-icon-badges.demolab.com/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white',
        'Git': 'https://custom-icon-badges.demolab.com/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white',
        'GitHub': 'https://custom-icon-badges.demolab.com/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white',
        'GitLab': 'https://custom-icon-badges.demolab.com/badge/GitLab-330F63?style=for-the-badge&logo=gitlab&logoColor=white',
        'Terraform': 'https://custom-icon-badges.demolab.com/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white',
        'Linux': 'https://custom-icon-badges.demolab.com/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black',
        'VS Code': 'https://custom-icon-badges.demolab.com/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white',
        'SAP': 'https://custom-icon-badges.demolab.com/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white'
    };

    return skills.map(skill => {
        const cleanSkill = skill.trim();
        const badgeUrl = badgeMap[cleanSkill];
        if (badgeUrl) {
            return `![${cleanSkill}](${badgeUrl})`;
        } else {
            // Fallback for skills not in the map
            const skillSlug = cleanSkill.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `![${cleanSkill}](https://custom-icon-badges.demolab.com/badge/${cleanSkill.replace(/\s+/g, '%20')}-blue?style=for-the-badge)`;
        }
    }).join('\n');
}

function generateReadme(resumeData: ResumeData): string {
    const fullName = `${resumeData.preName} ${resumeData.lastName}`;
    const avatarPath = `./img/${resumeData.avatar}`;
    const githubUrl = resumeData.github.startsWith('http') ? resumeData.github : `https://${resumeData.github}`;
    const linkedinUrl = resumeData.linkedin.startsWith('http') ? resumeData.linkedin : `https://${resumeData.linkedin}`;
    const websiteUrl = resumeData.website.startsWith('http') ? resumeData.website : `https://${resumeData.website}`;

    // Get technical skills for badges
    // const techSkills = resumeData.skills.find(skill => skill.field === "Technical Skills")?.entities || [];
    // const softSkills = resumeData.skills.find(skill => skill.field === "Soft Skills")?.entities || [];

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
${createTechSkillBadges(skill.entities)}
`).join('\n')}

## 🎓 Education

${resumeData.education.map(edu => `
### ${edu.degree} in ${edu.fieldOfStudy}
**${edu.university}** | ${edu.cityAndCountry}  
📅 ${edu.from} - ${edu.to}${edu.expected ? ` (Expected: ${edu.expected})` : ''}  
🎯 GPA: ${edu.gradePointAverage}
${edu.thesis ? `\n📝 Thesis: "${edu.thesis}" (Grade: ${edu.thesisGrade})` : ''}
`).join('\n')}

## 💼 Professional Experience

${resumeData.experience.map(exp => `
### ${exp.position}
**${cleanMarkdownLinks(exp.company)}** | ${exp.cityAndCountry}  
📅 ${exp.from} - ${exp.to}

${exp.infos.map(info => `• ${cleanMarkdownLinks(info)}`).join('\n')}
`).join('\n')}

## 🚀 Featured Projects

${resumeData.projects
            .filter((_, index) => resumeData.projectsToShowInProfessionalResume.includes(index))
            .map(project => {
                const imageSection = project.image ? `\n<img src="./img/${project.image}" alt="${project.name}" width="500" />` : '';
                const githubBadge = project.github ? `[![GitHub](https://custom-icon-badges.demolab.com/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://${project.github})` : '';
                const demoBadge = project.demo ? `[![Demo](https://custom-icon-badges.demolab.com/badge/Live_Demo-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://${project.demo})` : '';

                return `
### ${project.name}
${project.description}
${imageSection}

${[githubBadge, demoBadge].filter(badge => badge).join(' ')}
`;
            }).join('\n')}

## 🎯 Interests & Activities

${resumeData.extracurricularActivities.map(activity => `• ${activity}`).join('\n')}

---

<div align="center">
  
  ## 📊 GitHub Stats
  
  ![GitHub stats](https://github-readme-stats.vercel.app/api?username=${resumeData.github.split('/').pop()}&show_icons=true&theme=tokyonight)
  
  ![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${resumeData.github.split('/').pop()}&layout=compact&theme=tokyonight)
  
  ## 🔥 GitHub Streak
  
  ![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${resumeData.github.split('/').pop()}&theme=tokyonight)
  
  ---
  
  ### 🤝 Let's Connect!
  
  I'm always open to interesting conversations and collaboration opportunities!
  
  💬 **Feel free to reach out:** [${resumeData.email}](mailto:${resumeData.email})  
  🌐 **Visit my website:** [${resumeData.website}](${websiteUrl})  
    
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
