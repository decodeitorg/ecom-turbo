import { Error } from "mongoose";

let mapError = (err: any, message = "") => {
   let errorMessage: string;

   if (err instanceof Error.CastError) {
      errorMessage = `The value "${err.value}" is not a valid format for the field "${err.path}".`;
   } else if (err instanceof Error.ValidationError) {
      errorMessage = "The provided data is invalid. Please check the following errors:";
      errorMessage += `\n- ${Object.values(err.errors)
         .map((error) => error.message)
         .join("\n- ")}`;
   } else if (err.code === 11000) {
      errorMessage = "The data you provided already exists in the database.";
   } else if (err.name === "MongooseServerSelectionError") {
      errorMessage = "There is a problem connecting to the database. Please try again later.";
   } else if (err.name === "StrictModeError") {
      errorMessage = `The field "${err.path}" is not a valid field in the database schema.`;
   } else if (err.name === "OverwriteModelError") {
      errorMessage = "An internal error occurred. Please contact support.";
   } else if (err.name === "MissingSchemaError") {
      errorMessage = "An internal error occurred. Please contact support.";
   } else if (err.name === "DocumentNotFoundError") {
      errorMessage = "The requested data could not be found.";
   } else if (err.name === "ParallelSaveError") {
      errorMessage = "An internal error occurred. Please try again later.";
   } else if (err.name === "VersionError") {
      errorMessage = "The data you are trying to update has been modified by another user. Please refresh and try again.";
   } else if (message) {
      errorMessage = message;
   } else {
      errorMessage = "An unexpected error occurred. Please Contact Support.";
   }

   return errorMessage;
};

export default mapError;
