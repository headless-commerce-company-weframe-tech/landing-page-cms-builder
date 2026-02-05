import { Builder } from "@builder.io/react";
import type { Component, Input } from "@builder.io/sdk";
import type { ComponentType } from "react";

type TypeSafeTypes =
  | "string"
  | "number"
  | "boolean"
  | "longText"
  | "richText"
  | "file"
  | "color"
  | "date"
  | "email"
  | "object"
  | "list"
  | "reference";

//  type-safe version of the Input type
interface TypeSafeInput extends Omit<Input, "type" | "enum"> {
  type: TypeSafeTypes;
  enum?: string[] | { label: string; value: string }[];
  subFields?: TypeSafeInput[];
}

// type-safe version of the Component options
interface TypeSafeComponent extends Omit<Component, "inputs"> {
  inputs?: TypeSafeInput[];
}

//  wrapper class for Builder with type-safe methods
class TypeSafeBuilder {
  private static instance: TypeSafeBuilder;

  private constructor() {}

  static getInstance(): TypeSafeBuilder {
    if (!TypeSafeBuilder.instance) {
      TypeSafeBuilder.instance = new TypeSafeBuilder();
    }
    return TypeSafeBuilder.instance;
  }

  registerComponent<ComponentProps>(
    component: ComponentType<ComponentProps>,
    options: TypeSafeComponent,
  ) {
    return Builder.registerComponent(component, options as Component);
  }
}

//  singleton instance
const SafeBuilder = TypeSafeBuilder.getInstance();

const registerComponent = <ComponentProps>(
  component: ComponentType<ComponentProps>,
  options: TypeSafeComponent,
) => {
  return SafeBuilder.registerComponent(component, options);
};

export { registerComponent, SafeBuilder, type TypeSafeComponent };
