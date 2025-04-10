import {WebflowClient} from "webflow-api"
import {OauthScope} from "webflow-api/api/types/OAuthScope";


const authorizationUrl = WebflowClient.authorizeURL({
  clientId: process.env.WEBFLOW_CLIENT_ID as string,
  scope: process.env.WEBFLOW_SCOPES?.split(",") as OauthScope | OauthScope[]
});

const exchangeCodeForAccessToken = async (code: string): Promise<string> => {
  return await WebflowClient.getAccessToken({
    clientId: process.env.WEBFLOW_CLIENT_ID as string,
    clientSecret: process.env.WEBFLOW_CLIENT_SECRET,
    code,
  });
};

const webflowAuthClient = {
  authorizationUrl,
  exchangeCodeForAccessToken,
};

export default webflowAuthClient;

