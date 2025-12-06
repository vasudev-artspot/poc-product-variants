import { JSONSchemaType } from "ajv";

export interface SignUpFormData {
  firstName: string;
}

export const signUpFormSchema: JSONSchemaType<SignUpFormData> = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      minLength: 10,
      errorMessage: {
        minLength: "First Name should be minimum 10 characters long",
      },
    },
  },
  required: ["firstName"],
  additionalProperties: false,
};
