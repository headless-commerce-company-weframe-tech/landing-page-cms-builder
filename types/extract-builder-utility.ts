import type { Reference } from ".";

/**
 * Defines a set of string-based field types for the builder.
 */
type FieldType = "longText" | "richText" | "email" | "date" | "color" | "file";

/**
 * Converts all properties of an object to mutable (removes `readonly`), recursively handling nested objects.
 */

type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

/**
 * Utility to simplify and clean up unnecessary intersection types, providing a more readable structure.
 * This utility is HIM.
 */

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Extracts the `inputs` property from a configuration object if it is a readonly `Array`; otherwise, returns `never`.
 *
 * @typeParam T - The configuration object that may contain an `inputs` property.
 */

type ExtractInputs<T> = T extends { inputs: infer D }
  ? D extends readonly object[]
    ? D
    : never
  : never;

/**
 * Converts a readonly array into a union of its element types. Each element is processed by the `InferEnumValue` type.
 *
 * @typeParam T - The array of enum objects or plain strings.
 */

type ArrayToUnion<T> = T extends readonly object[]
  ? T[number] extends infer U
    ? InferEnumValue<U>
    : never
  : never;

/**
 * Infers the `"value"` property from an object or checks if the type is a string. Returns the inferred string or `never`.
 *
 * @typeParam T - The object or string representing an enum value.
 */

type InferEnumValue<T> = T extends { value: infer V extends string }
  ? V
  : T extends string
    ? T
    : never;

/**
 * Recursively generates a type from an array of sub-field definitions, distinguishing between required and optional fields.
 *
 * @typeParam T - The array of sub-field definitions.
 */

type ExtractSubFields<T> = T extends readonly object[]
  ? Prettify<
      {
        // Required fields
        [P in T[number] as P extends { name: infer N; required: true }
          ? N extends string
            ? N
            : never
          : never]-?: GetTypesForType<P>;
      } & {
        // Optional fields
        [P in T[number] as P extends { name: infer N }
          ? P extends { required: true }
            ? never
            : N extends string
              ? N
              : never
          : never]?: GetTypesForType<P>;
      }
    >
  : never;

/**
 * Infers the type of a field based on its type property. If the type is string, it uses the enum property (if present); if the type is object or list, it uses the subFields property to define nested structures.
 *
 * @typeParam T - The field definition object.
 */

type GetTypesForType<T> = T extends { type: infer Type extends string }
  ? Type extends "string"
    ? T extends { enum: infer SE }
      ? ArrayToUnion<SE>
      : string
    : Type extends FieldType
      ? string
      : Type extends "number"
        ? number
        : Type extends "boolean"
          ? boolean
          : Type extends "reference"
            ? Reference
            : Type extends "object"
              ? T extends { subFields: infer OSE }
                ? ExtractSubFields<OSE>
                : never
              : Type extends "list"
                ? T extends { subFields: infer LSE }
                  ? ExtractSubFields<LSE>[]
                  : never
                : never
  : never;

/**
 * Extracts fields from a configuration array and generates a type, separating required and optional fields.
 *
 * @typeParam T - The readonly array of field definitions.
 *
 */

type ExtractFields<T extends readonly object[]> = Prettify<
  {
    // Required properties
    [P in T[number] as P extends { name: infer N; required: true }
      ? N extends string
        ? N
        : never
      : never]: GetTypesForType<P>;
  } & {
    // Optional properties
    [P in T[number] as P extends { name: infer N }
      ? P extends { required: true }
        ? never
        : N extends string
          ? N
          : never
      : never]?: GetTypesForType<P>;
  }
>;

/**
 * Simplifies the process of generating types from a builder's configuration object.
 *
 * This utility extracts the `inputs` array from the configuration object and applies `ExtractFields` to infer the type structure.
 *
 * @typeParam T - The configuration object with an `inputs` property, which is a readonly array of field definitions.
 *
 */
type GenerateTypesFromBuilderConfig<T> = ExtractFields<ExtractInputs<T>>;

export type { DeepMutable, GenerateTypesFromBuilderConfig };
