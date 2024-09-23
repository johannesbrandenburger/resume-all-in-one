import Title from "@/components/title";
import data from "../../../in/data.json"
import DownloadProfessionalResumeButton from "@/components/download-resume";
import BackgroundAnimation from "@/components/background-animation";
import SectionHeading from "@/components/section-heading";
import { EducationCards } from "@/components/education-cards";
import { ExperienceCards } from "@/components/experience-cards";
import { ProjectCards } from "@/components/project-cards";
import Skills from "@/components/skills";
import ContactButtons from "@/components/contact-buttons";
import ImpressumButton from "@/components/impressum-button";
import ExtracurricularActivities from "@/components/extracurricular-activities";

export default function Home() {

  return (
    <>
      <BackgroundAnimation>

        <div className="mx-2">
          <Title preName={data.preName} lastName={data.lastName} objective={data.objective} avatar={data.avatar} />
          <ContactButtons telephone={data.telephone} email={data.email} github={data.github} linkedin={data.linkedin} website={data.website} />
          <DownloadProfessionalResumeButton filename={`resume-${data.preName.toLowerCase()}-${data.lastName.toLowerCase()}.pdf`} />

          <SectionHeading>Education</SectionHeading>
          <EducationCards items={data.education} />

          <SectionHeading>Skills</SectionHeading>
          <Skills topics={data.skills} />

          <SectionHeading>Experience</SectionHeading>
          <ExperienceCards items={data.experience} />
          
          <SectionHeading>Projects</SectionHeading>
          <ProjectCards items={data.projects} />
          
          <SectionHeading>Extracurricular Activities</SectionHeading>
          <ExtracurricularActivities extracurricularActivities={data.extracurricularActivities} />

          <ImpressumButton link={data.impressum} />
        </div>

      </BackgroundAnimation>
    </>
  );
}

