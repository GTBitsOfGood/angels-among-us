import { useRadio, Box } from "@chakra-ui/react";

function OnboardingOptionCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  console.log({ ...input });
  const checkbox = getCheckboxProps();
  console.log({ ...checkbox });

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="10px"
        backgroundColor="#EDEDED"
        width="200px"
        lineHeight="200px"
        textAlign="center"
        fontSize="2xl"
        fontWeight="semibold"
        marginX="60px"
        borderWidth="3px"
        borderColor="#EDEDED"
        _checked={{
          borderColor: "#000000",
        }}
        _focus={{}}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default OnboardingOptionCard;
