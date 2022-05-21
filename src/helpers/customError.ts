
export interface customErrorInterface { statusCode?: number, name?: string, message: string }
export class customError extends Error implements customErrorInterface {
       statusCode: number;
       name: string;
       constructor(message?: string, statusCode?: number, name?: string) {
              super(message);
              this.statusCode = statusCode as number,
                     this.name = name as string,
                     Object.setPrototypeOf(this, customError.prototype)
       }
};
