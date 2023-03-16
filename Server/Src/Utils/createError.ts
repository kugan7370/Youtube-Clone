
export interface CustomError extends Error {
    status?: number;
    message: string;
}


const createError = (status:number,message:string ) => {
    const error:CustomError = new Error();
    error.message = message;
    error.status = status;

    return error;

}

export default createError;