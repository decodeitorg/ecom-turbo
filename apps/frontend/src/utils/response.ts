type ResponseFunction = (data: any, message: string, statusCode: number) => Response;

export const response: ResponseFunction = (data = null, message, statusCode) => {
   try {
      return new Response(
         JSON.stringify({
            data: data,
            message: message,
         }),
         {
            status: statusCode,
            headers: {
               'content-type': 'application/json; charset=UTF-8',
            },
         },
      );
   } catch (err) {
      return new Response(
         JSON.stringify({
            data: null,
            message: 'Internal Server Error',
         }),
         {
            status: 400,
            headers: {
               'content-type': 'application/json; charset=UTF-8',
            },
         },
      );
   }
};
