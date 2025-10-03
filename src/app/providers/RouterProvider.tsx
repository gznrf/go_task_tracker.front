import { RouterProvider as Provider } from "react-router-dom";
import { router } from "../router";

export const RouterProvider = () => {
  return <Provider router={router} />;
};
