"use client";

import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useRegisterMutation } from "../../../generated/graphql";
import { mapErrors } from "../../../utils/mapErrors";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [{}, register] = useRegisterMutation();

  const handleRegister = async (
    values: { username: string; password: string },
    setErrors: (errors: any) => void,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const response = await register({ input: values });
      if (response.data?.register.errors) {
        setErrors(mapErrors(response.data.register.errors));
      } else if (response.data?.register.user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Register failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          handleRegister(values, setErrors, setSubmitting);
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
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
