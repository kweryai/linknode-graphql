import { ChainNode, ChainNodeArgs } from "@cellis/linknode";
import { GraphQLClient } from "graphql-request";
import { RequestConfig,Variables } from "graphql-request/build/esm/types";


export type GraphQlLinkNodeArgs = {
  uri: string;
  jwt?: string;
  query: string;
} & ChainNodeArgs<any, any>;

export class GraphqlNode<V extends Variables, O, G> extends ChainNode<V,O, G> {
  protected client: GraphQLClient;
  protected query: string;
  constructor(args: GraphQlLinkNodeArgs) {
    const { uri, jwt, query, ...rest } = args;

    super(rest);

    this.query = query;
    const clientOptions: RequestConfig = {
    };

    if (jwt) {
      clientOptions.headers = {
        Authorization: `Bearer ${jwt}`,
      };  
    }

    this.client = new GraphQLClient(uri, clientOptions);
  }

  async resolve(variables: V) {
    try {
      const result = await this.client.request<O>(
        this.query,
        variables,
      );

      super.resolve(result);
    } catch (error) {
      this.chain.dispatch('error', error);
    }
  }
}