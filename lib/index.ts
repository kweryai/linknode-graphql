import { ChainNode, ChainNodeArgs } from "@cellis/linknode";
import { GraphQLClient } from "graphql-request";
import { RequestConfig, RequestDocument, RequestOptions, Variables, VariablesAndRequestHeadersArgs } from "graphql-request/build/esm/types";

type GraphQlLinkNodeArgs<I,O> = {
  uri: string;
  jwt?: string;
} & ChainNodeArgs<any, any>;

export class GraphqlNode<I, O, V extends Variables> extends ChainNode<RequestOptions<V>,O> {
  protected client: GraphQLClient;
  constructor(args: GraphQlLinkNodeArgs<I, O>) {
    const { uri, jwt, ...rest } = args;

    super(rest);
    const clientOptions: RequestConfig = {
    };

    if (jwt) {
      clientOptions.headers = {
        Authorization: `Bearer ${jwt}`,
      };  
    }

    this.client = new GraphQLClient(uri, clientOptions);
  }

  async resolve(query: RequestOptions<V>): Promise<void> {
    try {
      // const result = await this.client.query<O,V>(data);
      const result = await this.client.request<O,V>(query);

      super.resolve(result);
    } catch (error) {
      this.chain.dispatch('error', error);
    }
  }
}