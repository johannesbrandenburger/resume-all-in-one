import { cn } from "@/utils/cn";
import React from "react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconCertificate
} from "@tabler/icons-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import NextImage from "next/image";
import { replaceMdWithNextLinks } from "@/utils/replace-md-with-next-links";
import { BentoGrid } from "./ui/bento-grid";

type EducationCardsProps = {
  items: {
    name: string;
    description: string;
    image?: string;
    github?: string;
    demo?: string;
  }[];

};


export function ProjectCards({ items }: EducationCardsProps) {
  return (
    <>

      {/* <BentoGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"> */}

      {items.map((item, i) => {

        const descriptionWithLinks = replaceMdWithNextLinks(item.description);

        return (
          <CardContainer className="inter-var mt-0" key={i}>
            <CardBody className="bg-gray-50/70 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black/70 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
              <CardItem
                translateZ="30"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {item.name}
              </CardItem>
              <CardItem
                as="p"
                translateZ="40"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {descriptionWithLinks}
              </CardItem>
              {item.image &&
                <CardItem translateZ="60" className="w-full mt-4">
                  <NextImage
                    src={"/" + item.image}
                    height="1000"
                    width="1000"
                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
              }
              {(item.github || item.demo) &&
                <div className="flex justify-between items-center mt-5">
                  {item.github &&
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black/20 dark:bg-white/20 text-xs font-normal dark:text-white"
                    >
                      <a href={"https://" + item.github.replace("https://" || "http://", "")} target="_blank">Github</a>
                    </CardItem>
                  }
                  {item.demo &&
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                      <a href={"https://" + item.demo.replace("https://" || "http://", "")} target="_blank">Demo</a>
                    </CardItem>
                  }
                </div>
              }
            </CardBody>
          </CardContainer>
        )
      })
      }
      {/* </BentoGrid> */}

    </>
  );
}

