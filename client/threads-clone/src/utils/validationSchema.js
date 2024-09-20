import * as Yup from "yup";

export const emailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const codeSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
});

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min("Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password & Confirm Password do not match.")
    .required("Confirm password is required"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});
