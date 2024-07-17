import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  children?: React.ReactNode;
  variant?: "small" | "regular";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box
      maxW={variant === "regular" ? "800px" : "400px"}
      mx="auto"
      w="100%"
      mt={8}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
