
export type WebflowAuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type WebflowSite = {
  id: string;
  workspaceId: string;
  displayName: string;
  shortName: string;
  previewUrl: string;
};

export type WebflowCustomCode = {
  id: string;
  location: "header" | "footer";
  version: string;
  attributes: { key: string };
};

export type WebflowCustomScript = {
  id: string;
  displayName: string;
  hostedLocation: string;
  integrityHash: string;
  canCopy: boolean;
  version: string;
};

// CMS FIELD TYPES

export enum CmsFieldType {
  Color = "Color",
  DateTime = "DateTime",
  Email = "Email",
  File = "File",
  Image = "Image",
  Link = "Link",
  MultiImage = "MultiImage",
  Number = "Number",
  Phone = "Phone",
  PlainText = "PlainText",
  RichText = "RichText",
  Switch = "Switch",
  Video = "Video",
}

