"use client";

import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useLoginMutation } from "../../../generated/graphql";
import { mapErrors } from "../../../utils/mapErrors";
import { useMutation, useQuery } from "@urql/next";
import {
  LoginDocument,
  LoginMutation,
  LoginMutationVariables,
} from "@/generated/server";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  // const [{}, login] = useLoginMutation();
  const [{}, login] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument
  );

  const handleLogin = async (
    values: { username: string; password: string },
    setErrors: (errors: any) => void,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const response = await login({ input: values });
      if (response.data?.login.errors) {
        setErrors(mapErrors(response.data.login.errors));
      } else if (response.data?.login.user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          handleLogin(values, setErrors, setSubmitting);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
