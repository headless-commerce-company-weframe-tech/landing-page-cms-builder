import type { DeepPartial } from "@/lib/utils";
import type {
  BuilderContentVariation,
  BuilderElement,
  Input,
} from "@builder.io/sdk";

type ReferenceValue<T extends object = object> = {
  type: "@builder.io/core:Reference" | string;
  id: string;
  model: string;
  value: {
    createdBy: string;
    createdDate: number;
    firstPublished: number;
    folders: unknown[];
    id: string;
    lastUpdated: number;
    lastUpdatedBy: string;
    modelId: string;
    name: string;
    query: unknown[];
    rev: string;
    testRatio: number;
    "@version": number | undefined;
    data: T & DeepPartial<BaseData>;
    meta: {
      kind: string;
      lastPreviewUrl: string;
      componentsUsed: unknown;
      hasLinks: boolean;
    };
    variations: {
      [id: string]: BuilderContentVariation | undefined;
    };
    published: "published" | "draft" | "archived" | undefined;
  };
};

type BaseData = {
  blocks: BuilderElement[] | undefined;
  inputs: Input[] | undefined;
  slug: string;
  url?: string;
  state: {
    deviceSize: "small" | "medium" | "large";
    location: unknown;
  };
  title: string;
  description: string;
};

type Reference = ReferenceValue;

export type { Reference, ReferenceValue, BaseData };
