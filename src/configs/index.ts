export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const WRITE_CONNECTION = process.env.WRITE_CONNECTION;
export const READ_CONNECTION = process.env.READ_CONNECTION;

export const RABBIT_MQ_CONNECTION = "amqp://localhost:15672/";

// main
export const RABBIT_EXCHANGE = "SOCIAL";

export const ARTICLE_ROUTE_KEY = "ARTICLE_ROUTE_KEY";
export const USER_ROUTE_KEY = "USER_ROUTE_KEY";
export const PROFILE_ROUTE_KEY = "PROFILECLE_ROUTE_KEY";

export const ARTICLE_QUEUE = "ARTICLE_QUEUE";
export const USER_QUEUE = "USER_QUEUE";
export const PROFILE_QUEUE = "PROFILE_QUEUE";
export const FILE_QUEUE = "FILE_QUEUE";

// dead letter
export const RABBIT_DL_EXCHANGE = "SOCIAL_DL";

export const ARTICLE_DL_ROUTE_KEY = "ARTICLE_DL_ROUTE_KEY";
export const USER_DL_ROUTE_KEY = "USER_DL_ROUTE_KEY";
export const PROFILE_DL_ROUTE_KEY = "PROFILE_DL_ROUTE_KEY";

export const ARTICLE_DLQ = "ARTICLE_DLQ";
export const USER_DLQ = "USER_DLQ";
export const PROFILE_DLQ = "PROFILE_DLQ";

export const ARTICLE_RMQ_CLIENT = "ARTICLE_RMQ_CLIENT";
export const USER_RMQ_CLIENT = "USER_RMQ_CLIENT";
export const PROFILE_RMQ_CLIENT = "PROFILE_RMQ_CLIENT";
export const FILE_RMQ_CLIENT = "FILE_RMQ_CLIENT";
