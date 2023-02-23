import { Button } from "@chakra-ui/react";

function OnboardingSingleBtn(props: { onClickFunc: (arg: void) => void }) {
  const { onClickFunc } = props;

  return (
    <Button
      className="getStartedBtn"
      onClick={() => onClickFunc()}
      borderWidth="1px"
      borderColor="#000000"
      backgroundColor="#000000"
      textColor="#FFFFFF"
      fontSize={{ base: "16px", md: "20px", lg: "24px" }}
      fontWeight="semibold"
      borderRadius="10px"
      paddingX={{ base: "100px", md: "18px", lg: "18px" }}
      paddingY={{ base: "22px", md: "25px", lg: "25px" }}
    >
      Get started! {">"}
    </Button>
  );
}

export default OnboardingSingleBtn;
