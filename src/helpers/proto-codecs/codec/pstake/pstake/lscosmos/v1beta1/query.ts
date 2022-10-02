/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Params } from "./pstake/lscosmos/v1beta1/params";
import {
  HostChainParams,
  DelegationState,
  AllowListedValidators,
  IBCAmountTransientStore,
} from "./pstake/lscosmos/v1beta1/lscosmos";

export const protobufPackage = "pstake.lscosmos.v1beta1";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: Params;
}

/** QueryHostChainParamsRequest is request for the Ouery/HostChainParams methods. */
export interface QueryHostChainParamsRequest {}

/** QueryHostChainParamsResponse is response for the Ouery/HostChainParams methods. */
export interface QueryHostChainParamsResponse {
  hostChainParams?: HostChainParams;
}

/** QueryDelegationStateRequest is request for the Ouery/DelegationState methods. */
export interface QueryDelegationStateRequest {}

/** QueryDelegationStateResponse is response for the Ouery/DelegationState methods. */
export interface QueryDelegationStateResponse {
  delegationState?: DelegationState;
}

/** QueryListedValidatorsRequest is a request for the Query/AllowListedValidators methods. */
export interface QueryAllowListedValidatorsRequest {}

/** QueryListedValidatorsResponse is a response for the Query/AllowListedValidators methods. */
export interface QueryAllowListedValidatorsResponse {
  allowListedValidators?: AllowListedValidators;
}

/** QueryCValueRequest is a request for the Query/CValue methods. */
export interface QueryCValueRequest {}

/** QueryCValueRequest is a response for the Query/CValue methods. */
export interface QueryCValueResponse {
  cValue: string;
}

/** QueryModuleStateRequest is a request for the Query/ModuleState methods. */
export interface QueryModuleStateRequest {}

/** QueryModuleStateRequest is a response for the Query/ModuleState methods. */
export interface QueryModuleStateResponse {
  moduleState: boolean;
}

/** QueryIBCTransientStoreRequest is a request for the Query/IBCTransientStore methods. */
export interface QueryIBCTransientStoreRequest {}

/** QueryIBCTransientStoreRequest is a response for the Query/IBCTransientStore methods. */
export interface QueryIBCTransientStoreResponse {
  iBCTransientStore?: IBCAmountTransientStore;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(
    _: QueryParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(
    _: I
  ): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(
    object: I
  ): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    return message;
  },
};

function createBaseQueryHostChainParamsRequest(): QueryHostChainParamsRequest {
  return {};
}

export const QueryHostChainParamsRequest = {
  encode(
    _: QueryHostChainParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryHostChainParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryHostChainParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryHostChainParamsRequest {
    return {};
  },

  toJSON(_: QueryHostChainParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryHostChainParamsRequest>, I>>(
    _: I
  ): QueryHostChainParamsRequest {
    const message = createBaseQueryHostChainParamsRequest();
    return message;
  },
};

function createBaseQueryHostChainParamsResponse(): QueryHostChainParamsResponse {
  return { hostChainParams: undefined };
}

export const QueryHostChainParamsResponse = {
  encode(
    message: QueryHostChainParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.hostChainParams !== undefined) {
      HostChainParams.encode(
        message.hostChainParams,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryHostChainParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryHostChainParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hostChainParams = HostChainParams.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryHostChainParamsResponse {
    return {
      hostChainParams: isSet(object.hostChainParams)
        ? HostChainParams.fromJSON(object.hostChainParams)
        : undefined,
    };
  },

  toJSON(message: QueryHostChainParamsResponse): unknown {
    const obj: any = {};
    message.hostChainParams !== undefined &&
      (obj.hostChainParams = message.hostChainParams
        ? HostChainParams.toJSON(message.hostChainParams)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryHostChainParamsResponse>, I>>(
    object: I
  ): QueryHostChainParamsResponse {
    const message = createBaseQueryHostChainParamsResponse();
    message.hostChainParams =
      object.hostChainParams !== undefined && object.hostChainParams !== null
        ? HostChainParams.fromPartial(object.hostChainParams)
        : undefined;
    return message;
  },
};

function createBaseQueryDelegationStateRequest(): QueryDelegationStateRequest {
  return {};
}

export const QueryDelegationStateRequest = {
  encode(
    _: QueryDelegationStateRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDelegationStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDelegationStateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryDelegationStateRequest {
    return {};
  },

  toJSON(_: QueryDelegationStateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryDelegationStateRequest>, I>>(
    _: I
  ): QueryDelegationStateRequest {
    const message = createBaseQueryDelegationStateRequest();
    return message;
  },
};

function createBaseQueryDelegationStateResponse(): QueryDelegationStateResponse {
  return { delegationState: undefined };
}

export const QueryDelegationStateResponse = {
  encode(
    message: QueryDelegationStateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.delegationState !== undefined) {
      DelegationState.encode(
        message.delegationState,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDelegationStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDelegationStateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegationState = DelegationState.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDelegationStateResponse {
    return {
      delegationState: isSet(object.delegationState)
        ? DelegationState.fromJSON(object.delegationState)
        : undefined,
    };
  },

  toJSON(message: QueryDelegationStateResponse): unknown {
    const obj: any = {};
    message.delegationState !== undefined &&
      (obj.delegationState = message.delegationState
        ? DelegationState.toJSON(message.delegationState)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryDelegationStateResponse>, I>>(
    object: I
  ): QueryDelegationStateResponse {
    const message = createBaseQueryDelegationStateResponse();
    message.delegationState =
      object.delegationState !== undefined && object.delegationState !== null
        ? DelegationState.fromPartial(object.delegationState)
        : undefined;
    return message;
  },
};

function createBaseQueryAllowListedValidatorsRequest(): QueryAllowListedValidatorsRequest {
  return {};
}

export const QueryAllowListedValidatorsRequest = {
  encode(
    _: QueryAllowListedValidatorsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryAllowListedValidatorsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllowListedValidatorsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryAllowListedValidatorsRequest {
    return {};
  },

  toJSON(_: QueryAllowListedValidatorsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<
    I extends Exact<DeepPartial<QueryAllowListedValidatorsRequest>, I>
  >(_: I): QueryAllowListedValidatorsRequest {
    const message = createBaseQueryAllowListedValidatorsRequest();
    return message;
  },
};

function createBaseQueryAllowListedValidatorsResponse(): QueryAllowListedValidatorsResponse {
  return { allowListedValidators: undefined };
}

export const QueryAllowListedValidatorsResponse = {
  encode(
    message: QueryAllowListedValidatorsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.allowListedValidators !== undefined) {
      AllowListedValidators.encode(
        message.allowListedValidators,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryAllowListedValidatorsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllowListedValidatorsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.allowListedValidators = AllowListedValidators.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllowListedValidatorsResponse {
    return {
      allowListedValidators: isSet(object.allowListedValidators)
        ? AllowListedValidators.fromJSON(object.allowListedValidators)
        : undefined,
    };
  },

  toJSON(message: QueryAllowListedValidatorsResponse): unknown {
    const obj: any = {};
    message.allowListedValidators !== undefined &&
      (obj.allowListedValidators = message.allowListedValidators
        ? AllowListedValidators.toJSON(message.allowListedValidators)
        : undefined);
    return obj;
  },

  fromPartial<
    I extends Exact<DeepPartial<QueryAllowListedValidatorsResponse>, I>
  >(object: I): QueryAllowListedValidatorsResponse {
    const message = createBaseQueryAllowListedValidatorsResponse();
    message.allowListedValidators =
      object.allowListedValidators !== undefined &&
      object.allowListedValidators !== null
        ? AllowListedValidators.fromPartial(object.allowListedValidators)
        : undefined;
    return message;
  },
};

function createBaseQueryCValueRequest(): QueryCValueRequest {
  return {};
}

export const QueryCValueRequest = {
  encode(
    _: QueryCValueRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCValueRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCValueRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryCValueRequest {
    return {};
  },

  toJSON(_: QueryCValueRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryCValueRequest>, I>>(
    _: I
  ): QueryCValueRequest {
    const message = createBaseQueryCValueRequest();
    return message;
  },
};

function createBaseQueryCValueResponse(): QueryCValueResponse {
  return { cValue: "" };
}

export const QueryCValueResponse = {
  encode(
    message: QueryCValueResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.cValue !== "") {
      writer.uint32(10).string(message.cValue);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCValueResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCValueResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cValue = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryCValueResponse {
    return {
      cValue: isSet(object.cValue) ? String(object.cValue) : "",
    };
  },

  toJSON(message: QueryCValueResponse): unknown {
    const obj: any = {};
    message.cValue !== undefined && (obj.cValue = message.cValue);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryCValueResponse>, I>>(
    object: I
  ): QueryCValueResponse {
    const message = createBaseQueryCValueResponse();
    message.cValue = object.cValue ?? "";
    return message;
  },
};

function createBaseQueryModuleStateRequest(): QueryModuleStateRequest {
  return {};
}

export const QueryModuleStateRequest = {
  encode(
    _: QueryModuleStateRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryModuleStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryModuleStateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryModuleStateRequest {
    return {};
  },

  toJSON(_: QueryModuleStateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryModuleStateRequest>, I>>(
    _: I
  ): QueryModuleStateRequest {
    const message = createBaseQueryModuleStateRequest();
    return message;
  },
};

function createBaseQueryModuleStateResponse(): QueryModuleStateResponse {
  return { moduleState: false };
}

export const QueryModuleStateResponse = {
  encode(
    message: QueryModuleStateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.moduleState === true) {
      writer.uint32(8).bool(message.moduleState);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryModuleStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryModuleStateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moduleState = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryModuleStateResponse {
    return {
      moduleState: isSet(object.moduleState)
        ? Boolean(object.moduleState)
        : false,
    };
  },

  toJSON(message: QueryModuleStateResponse): unknown {
    const obj: any = {};
    message.moduleState !== undefined &&
      (obj.moduleState = message.moduleState);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryModuleStateResponse>, I>>(
    object: I
  ): QueryModuleStateResponse {
    const message = createBaseQueryModuleStateResponse();
    message.moduleState = object.moduleState ?? false;
    return message;
  },
};

function createBaseQueryIBCTransientStoreRequest(): QueryIBCTransientStoreRequest {
  return {};
}

export const QueryIBCTransientStoreRequest = {
  encode(
    _: QueryIBCTransientStoreRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryIBCTransientStoreRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIBCTransientStoreRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryIBCTransientStoreRequest {
    return {};
  },

  toJSON(_: QueryIBCTransientStoreRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryIBCTransientStoreRequest>, I>>(
    _: I
  ): QueryIBCTransientStoreRequest {
    const message = createBaseQueryIBCTransientStoreRequest();
    return message;
  },
};

function createBaseQueryIBCTransientStoreResponse(): QueryIBCTransientStoreResponse {
  return { iBCTransientStore: undefined };
}

export const QueryIBCTransientStoreResponse = {
  encode(
    message: QueryIBCTransientStoreResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.iBCTransientStore !== undefined) {
      IBCAmountTransientStore.encode(
        message.iBCTransientStore,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryIBCTransientStoreResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIBCTransientStoreResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.iBCTransientStore = IBCAmountTransientStore.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryIBCTransientStoreResponse {
    return {
      iBCTransientStore: isSet(object.iBCTransientStore)
        ? IBCAmountTransientStore.fromJSON(object.iBCTransientStore)
        : undefined,
    };
  },

  toJSON(message: QueryIBCTransientStoreResponse): unknown {
    const obj: any = {};
    message.iBCTransientStore !== undefined &&
      (obj.iBCTransientStore = message.iBCTransientStore
        ? IBCAmountTransientStore.toJSON(message.iBCTransientStore)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryIBCTransientStoreResponse>, I>>(
    object: I
  ): QueryIBCTransientStoreResponse {
    const message = createBaseQueryIBCTransientStoreResponse();
    message.iBCTransientStore =
      object.iBCTransientStore !== undefined &&
      object.iBCTransientStore !== null
        ? IBCAmountTransientStore.fromPartial(object.iBCTransientStore)
        : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  HostChainParams(
    request: QueryHostChainParamsRequest
  ): Promise<QueryHostChainParamsResponse>;
  DelegationState(
    request: QueryDelegationStateRequest
  ): Promise<QueryDelegationStateResponse>;
  AllowListedValidators(
    request: QueryAllowListedValidatorsRequest
  ): Promise<QueryAllowListedValidatorsResponse>;
  CValue(request: QueryCValueRequest): Promise<QueryCValueResponse>;
  ModuleState(
    request: QueryModuleStateRequest
  ): Promise<QueryModuleStateResponse>;
  IBCTransientStore(
    request: QueryIBCTransientStoreRequest
  ): Promise<QueryIBCTransientStoreResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.HostChainParams = this.HostChainParams.bind(this);
    this.DelegationState = this.DelegationState.bind(this);
    this.AllowListedValidators = this.AllowListedValidators.bind(this);
    this.CValue = this.CValue.bind(this);
    this.ModuleState = this.ModuleState.bind(this);
    this.IBCTransientStore = this.IBCTransientStore.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "Params",
      data
    );
    return promise.then((data) =>
      QueryParamsResponse.decode(new _m0.Reader(data))
    );
  }

  HostChainParams(
    request: QueryHostChainParamsRequest
  ): Promise<QueryHostChainParamsResponse> {
    const data = QueryHostChainParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "HostChainParams",
      data
    );
    return promise.then((data) =>
      QueryHostChainParamsResponse.decode(new _m0.Reader(data))
    );
  }

  DelegationState(
    request: QueryDelegationStateRequest
  ): Promise<QueryDelegationStateResponse> {
    const data = QueryDelegationStateRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "DelegationState",
      data
    );
    return promise.then((data) =>
      QueryDelegationStateResponse.decode(new _m0.Reader(data))
    );
  }

  AllowListedValidators(
    request: QueryAllowListedValidatorsRequest
  ): Promise<QueryAllowListedValidatorsResponse> {
    const data = QueryAllowListedValidatorsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "AllowListedValidators",
      data
    );
    return promise.then((data) =>
      QueryAllowListedValidatorsResponse.decode(new _m0.Reader(data))
    );
  }

  CValue(request: QueryCValueRequest): Promise<QueryCValueResponse> {
    const data = QueryCValueRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "CValue",
      data
    );
    return promise.then((data) =>
      QueryCValueResponse.decode(new _m0.Reader(data))
    );
  }

  ModuleState(
    request: QueryModuleStateRequest
  ): Promise<QueryModuleStateResponse> {
    const data = QueryModuleStateRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "ModuleState",
      data
    );
    return promise.then((data) =>
      QueryModuleStateResponse.decode(new _m0.Reader(data))
    );
  }

  IBCTransientStore(
    request: QueryIBCTransientStoreRequest
  ): Promise<QueryIBCTransientStoreResponse> {
    const data = QueryIBCTransientStoreRequest.encode(request).finish();
    const promise = this.rpc.request(
      "pstake.lscosmos.v1beta1.Query",
      "IBCTransientStore",
      data
    );
    return promise.then((data) =>
      QueryIBCTransientStoreResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
