import { CheckboxGroup, Checkbox, Stack } from "@chakra-ui/react";

function OnboardingOptionCard(props: { options: string[] }) {
  const { options } = props;

  return (
    <CheckboxGroup colorScheme="blackAlpha">
      <Stack spacing={[1, 5]} direction={["column", "row"]}>
        {options.map((o) => {
          return <Checkbox>{o}</Checkbox>;
        })}
      </Stack>
    </CheckboxGroup>
  );
}

export default OnboardingOptionCard;
