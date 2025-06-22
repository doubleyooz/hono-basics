// 100: The server has received the request headers and the client should proceed to send the request body.
export const CONTINUE = 100;

// 101: The requester has asked the server to switch protocols.
export const SWITCHING_PROTOCOLS = 101;

// 200: The request has succeeded.
export const OK = 200;

// 201: The request has been fulfilled and resulted in a new resource being created.
export const CREATED = 201;

// 202: The request has been accepted for processing, but the processing has not been completed.
export const ACCEPTED = 202;

// 203: The server successfully processed the request, but is returning information that may be from another source.
export const NON_AUTHORITATIVE_INFORMATION = 203;

// 204: The server successfully processed the request, but is not returning any content.
export const NO_CONTENT = 204;

// 205: The server successfully processed the request, asks that the requester reset its document view.
export const RESET_CONTENT = 205;

// 206: The server is delivering only part of the resource due to a range header sent by the client.
export const PARTIAL_CONTENT = 206;

// 300: Indicates multiple options for the resource from which the client may choose.
export const MULTIPLE_CHOICES = 300;

// 301: This and all future requests should be directed to the given URI.
export const MOVED_PERMANENTLY = 301;

// 302: The requested resource resides temporarily under a different URI.
export const FOUND = 302;

// 303: The response to the request can be found under another URI using a GET method.
export const SEE_OTHER = 303;

// 304: Indicates that the resource has not been modified since the version specified by the request headers.
export const NOT_MODIFIED = 304;

// 305: The requested resource must be accessed through the proxy given by the Location field.
export const USE_PROXY = 305;

// 307: In this case, the request should be repeated with another URI; however, future requests should still use the original URI.
export const TEMPORARY_REDIRECT = 307;

// 400: The server cannot or will not process the request due to an apparent client error.
export const BAD_REQUEST = 400;

// 401: Authentication is required and has failed or has not yet been provided.
export const UNAUTHORIZED = 401;

// 402: Reserved for future use.
export const PAYMENT_REQUIRED = 402;

// 403: The request was valid, but the server is refusing action.
export const FORBIDDEN = 403;

// 404: The requested resource could not be found.
export const NOT_FOUND = 404;

// 405: A request method is not supported for the requested resource.
export const METHOD_NOT_ALLOWED = 405;

// 406: The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
export const NOT_ACCEPTABLE = 406;

// 407: The client must first authenticate itself with the proxy.
export const PROXY_AUTHENTICATION_REQUIRED = 407;

// 408: The server timed out waiting for the request.
export const REQUEST_TIMEOUT = 408;

// 409: Indicates that the request could not be processed because of conflict in the request.
export const CONFLICT = 409;

// 410: Indicates that the resource requested is no longer available and will not be available again.
export const GONE = 410;

// 411: The request did not specify the length of its content, which is required by the requested resource.
export const LENGTH_REQUIRED = 411;

// 412: The server does not meet one of the preconditions that the requester put on the request.
export const PRECONDITION_FAILED = 412;

// 413: The request is larger than the server is willing or able to process.
export const REQUEST_ENTITY_TOO_LARGE = 413;

// 414: The URI provided was too long for the server to process.
export const REQUEST_URI_TOO_LONG = 414;

// 415: The request entity has a media type which the server or resource does not support.
export const UNSUPPORTED_MEDIA_TYPE = 415;

// 416: The client has asked for a portion of the file, but the server cannot supply that portion.
export const REQUESTED_RANGE_NOT_SATISFIABLE = 416;

// 417: The server cannot meet the requirements of the Expect request-header field.
export const EXPECTATION_FAILED = 417;

// 500: A generic error message, given when an unexpected condition was encountered.
export const INTERNAL_SERVER_ERROR = 500;

// 501: The server either does not recognize the request method, or it lacks the ability to fulfill the request.
export const NOT_IMPLEMENTED = 501;

// 502: The server was acting as a gateway or proxy and received an invalid response from the upstream server.
export const BAD_GATEWAY = 502;

// 503: The server is currently unavailable (because it is overloaded or down for maintenance).
export const SERVICE_UNAVAILABLE = 503;

// 504: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
export const GATEWAY_TIMEOUT = 504;

// 505: The server does not support the HTTP protocol version used in the request.
export const HTTP_VERSION_NOT_SUPPORTED = 505;
