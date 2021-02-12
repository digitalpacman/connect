import { FormDefinition } from "@shipengine/connect";

const connectionForm: FormDefinition = {
  dataSchema: {
    title: "Login Form Example",
    description: "Connect to your account.",
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        title: "Email Address",
        type: "string",
        format: "email",
      },
      password: {
        title: "Password",
        type: "string",
        minLength: 8,
      },
    },
  },
  uiSchema: {
    email: {
      "ui:autofocus": true
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Note: password is case sensitive",
    },
  },
};

export default connectionForm;
