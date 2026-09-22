namespace API {
  export const QueryKeys = {
    Account: "Account",
    Orders: "Orders",
  };

  export namespace User {
    export enum Role {
      USER,
      ADMIN,
    }

    export interface T {
      user: string;
      name: string;
      role: API.User.Role;
    }
  }

  export namespace Authentication {
    export namespace Me {
      export const URL = "/api/v1/auth/me";

      export interface Response {
        user: string;
        name: string;
        role: API.User.Role;
      }
    }

    export namespace Authenticate {
      export const URL = "/api/v1/auth/authenticate";

      export interface RequestBody {
        name: string;
        password: string;
      }

      export interface Response {
        access_token: string;
        data: API.User.T;
      }
    }
  }

  export namespace Order {
    export enum Status {
      NEW = "Новый",
      DONE = "Выполнен",
    }

    export interface T {
      id: number;
      name: string;
      address: string;
      date: string;
      status: API.Order.Status;
      comment: string;
    }

    export namespace GetAll {
      export const URL = "/api/v1/orders";

      export type Response = API.Order.T[];
    }

    export namespace PostCreate {
      export const URL = "/api/v1/orders";

      export interface RequestBody {
        name: string;
        address: string;
        date: string;
        status: API.Order.Status;
        comment: string;
      }
    }
  }
}

export default API;
