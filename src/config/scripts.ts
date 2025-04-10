export type ScriptConfig = {
  displayName: string;
  version: string;
  location: "header" | "footer";
  path?: string;
  hosted?: boolean;
  hostedLocation?: string;
  integrityHash?: string;
};

export const CUSTOM_SCRIPTS_NAME = {
  SLIDER_SCRIPT: "Slider Script",
} as const;

type scriptKeys = keyof typeof CUSTOM_SCRIPTS_NAME;
export type customScriptName = (typeof CUSTOM_SCRIPTS_NAME)[scriptKeys];

export const CUSTOM_SCRIPTS_CONFIG: {
  [key in customScriptName]: ScriptConfig;
} = {
  [CUSTOM_SCRIPTS_NAME.SLIDER_SCRIPT]: {
    displayName: CUSTOM_SCRIPTS_NAME.SLIDER_SCRIPT,
    location: "footer",
    version: process.env.CDN_VERSION, //"2.1.0",
    hosted: true,
    hostedLocation:process.env.HOSTED_LOCATION,

    integrityHash:process.env.INTEGRITYHASH,

  },
};
