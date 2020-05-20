import { PackagingDefinition } from "@shipengine/integration-platform-sdk";

const examplePackaging: PackagingDefinition = {
  id: "<%- _uuidv4 %>",
  name: "Box",
  description:
    "Your own box. Cannot be longer than 36 inches or weigh more than 150 pounds",
  requiresWeight: true,
  requiresDimensions: true,
};

export default examplePackaging;
