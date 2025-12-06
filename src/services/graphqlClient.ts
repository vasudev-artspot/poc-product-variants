import { GraphQLClient } from "graphql-request";
import { CONTENT_SERVICE_URL } from "./constants";
import { getCookie } from "../utils/utils";
import { CONSTANTS } from "../constant/constant";

const createGraphQLClient = () => {
  const token = getCookie(CONSTANTS.TOKEN);
  return new GraphQLClient(CONTENT_SERVICE_URL, {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export const graphqlRequest = async <T>(
  query: string,
  variables?: any
): Promise<T> => {
  const client = createGraphQLClient();
  return client.request(query, variables);
};
