"use client";

import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../../generated/graphql";
import { mapErrors } from "../../utils/mapErrors";
import { createUrqlClient } from "@/utils/createUrqlClient";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const { client, ssr } = createUrqlClient();

  const router = useRouter();
  const [{}, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      {" "}
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ input: values });
          if (response.data?.login.errors) {
            setErrors(mapErrors(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
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
