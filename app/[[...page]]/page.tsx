import { builderPageModelName } from "@/data/builder-model-names";
import { RenderBuilderContent } from "@/components/render-builder-component";
import builder from "@/config/builder";
import type { Metadata } from "next";

export const generateStaticParams = async () => {
  const pages = await builder.getAll(builderPageModelName, {
    options: { noTargeting: true },
    cachebust: true,
    fields: "data.url",
  });

  return pages.map(({ data }) => {
    // `data.url` can also be an array (For example: in `/dev-space` page)
    let url = data!.url || ("" as string | string[]);
    url = Array.isArray(url) ? url[0] : url;

    return {
      page: url.split("/").filter(Boolean),
    };
  });
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[[...page]]">): Promise<Metadata> => {
  const { page } = await params;
  const content = (await builder.get(builderPageModelName, {
    userAttributes: {
      urlPath: `/${page?.map((param) => (param === "index" ? "" : param)).join("/") ?? ""}`,
    },
    cachebust: true,
    omit: "data.blocks",
    fields: "data.title,data.description,data.index",
  })) as { data: { title: string; description: string; index: boolean } };

  if (!content)
    return {
      title: "",
      description: "",
      robots: "noindex,follow",
    };

  return {
    title: content.data.title,
    description: content.data.description,
    robots: content.data?.index == false ? "noindex,follow" : "index,follow", //comparing index to false to handle default value as true
  };
};

async function Page({ params }: PageProps<"/[[...page]]">) {
  const { page } = await params;
  const urlPath = `/${page?.map((param) => (param === "index" ? "" : param)).join("/") ?? ""}`;

  const content = await builder.get(builderPageModelName, {
    cachebust: true,
    userAttributes: { urlPath },
  });

  return (
    <RenderBuilderContent content={content} model={builderPageModelName} />
  );
}

export default Page;
