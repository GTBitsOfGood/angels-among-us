import { PhoneIcon } from "@chakra-ui/icons";
import { Flex, Stack, Text, Box, Divider } from "@chakra-ui/react";
import pageAccessHOC from "../components/HOC/PageAccess";

export type Team = {
  teamName: string;
  primaryContact?: string;
  contacts: Contact[];
};

export type Contact = {
  email: string;
  purpose: string;
};

const TEAMS: Team[] = [
  {
    teamName: "Kim Kay",
    contacts: [
      {
        email: "kimkay",
        purpose:
          "any questions, problems, concerns, suggestions, or if you don't know '",
      },
    ],
  },
  {
    teamName: "Intakes Teams",
    contacts: [
      {
        email: "approval",
        purpose: "for requesting dogs be pulled with foster offer included",
      },
      {
        email: "intakevetting",
        purpose: "questions about pickup for new intakes you are fostering",
      },
      {
        email: "returns",
        purpose: "where adopters need to email if they wish to return a dog",
      },
    ],
  },
  {
    teamName: "Dog Records Team",
    primaryContact: "Marcia Hockenbery (marcia@angelsrescue.org)",
    contacts: [
      {
        email: "records",
        purpose:
          "all records questions, including if an adopter asks you for records, please do not give out any records as it is confusing when incomplete",
      },
      {
        email: "moves",
        purpose:
          "where fosters email whenever a dog is moved to/from a temp, vet, or boarding facility",
      },
    ],
  },
  {
    teamName: "Vetting Teams",
    primaryContact: "Samantha Orr (samanthao@angelsrescue.org)",
    contacts: [
      {
        email: "vets",
        purpose:
          "non-emergency vet appointments and any medical questions about your foster",
      },
      {
        email: "heartworm",
        purpose: "all vetting & questions for heartworm positive dogs",
      },
      {
        email: "spayneuter",
        purpose:
          "to schedule spay/neuter, please wait 5 - 7 days after getting new foster to contact so we have intake records",
      },
      {
        email: "prevents",
        purpose:
          "to ask for prevents in your area OR if you give your own supply to let them know to add to the dog's record. You should email prevents@ every month",
      },
      {
        email: "pharmacy",
        purpose: "for prescription refills, medication & food",
      },
    ],
  },
  {
    teamName: "Foster Teams",
    contacts: [
      {
        email: "foster",
        purpose:
          "foster offers & placement issues (need new foster), general fostering questions",
      },
      {
        email: "fosteroffer",
        purpose:
          "foster offers on new intake dogs (you will be directed in the post if this address should be used instead of the general one)",
      },
      {
        email: "tempfoster",
        purpose: "to request a temp foster or offer to temp foster",
      },
      {
        email: "fhc",
        purpose: "to send initial foster home check paperwork",
      },
      {
        email: "rechecks",
        purpose: "to send foster home recheck paperwork",
      },
      {
        email: "boardingadmin",
        purpose: "for questions about boarding dogs",
      },
      {
        email: "mentors",
        purpose:
          "if you don’t know who your mentor is or can’t reach them, all mentors are here",
      },
      {
        email: "certificates",
        purpose: "to send Maddie’s Fund training certificates",
      },
      {
        email: "waivers",
        purpose:
          "to send waivers for specific dogs when a temperament waiver is required",
      },
    ],
  },
  {
    teamName: "Adoption Teams",
    contacts: [
      {
        email: "adopt",
        purpose:
          "general adoption related questions, foster fails, fees, paperwork",
      },
      {
        email: "petfinder",
        purpose:
          "3 pics & bio of each dog need to to be sent within 3 - 5 days and updated as needed",
      },
      {
        email: "imadopted",
        purpose:
          'email here EVERY time your foster is adopted, pre-adopted, or FF to ensure adopter receives paperwork quickly & you can include "Happy Tails" picture for Facebook',
      },
      {
        email: "returns",
        purpose:
          "if an adopter contacts you about returning your foster, they must go through this team",
      },
    ],
  },
  {
    teamName: "Foster Support Teams",
    contacts: [
      {
        email: "training",
        purpose:
          "for training or behavior problems to receive advice or if more severe, professional training",
      },
      {
        email: "supplies",
        purpose: "to borrow crates or get other supplies for your foster",
      },
    ],
  },
  {
    teamName: "Cat Teams",
    contacts: [
      {
        email: "cats",
        purpose: "for cat related questions including intake requests",
      },
      {
        email: "catvets",
        purpose: "for cat medical questions and issues",
      },
      {
        email: "catrecords",
        purpose: "for cat records, pull paperwork, and adoption packages",
      },
      {
        email: "catfoster",
        purpose:
          "for cat fostering related issues and information, foster offers",
      },
      {
        email: "catadopt",
        purpose: "for cat adoption questions and issues",
      },
      {
        email: "catpetfinder",
        purpose:
          "to send pictures, a bio, and video of your cat foster for adoption sites",
      },
      {
        email: "catpost",
        purpose:
          "to have your foster cat posted on the main page to help with adoption",
      },
      {
        email: "catadopted",
        purpose:
          "to turn in adoption paperwork once your foster cat is adopted",
      },
    ],
  },
  {
    teamName: "Volunteer Teams",
    primaryContact: " Susan DuBois (susan@angelsrescue.org)",
    contacts: [
      {
        email: "volunteers",
        purpose:
          "to offer to volunteer on a team or to transport, general volunteering questions",
      },
      {
        email: "recognition",
        purpose:
          "to ask that a card be sent to another foster or volunteer going through a difficult time or for going above and beyond",
      },
      {
        email: "fbgroups",
        purpose:
          "to be added to one of our internal pages, must be current foster or volunteer",
      },
    ],
  },
  {
    teamName: "Social Media & Marketing Teams",
    primaryContact: "Hilary Van Brunt (hilaryv@angelsrescue.org)",
    contacts: [
      {
        email: "socialmedia",
        purpose:
          "to send pictures and video of your foster for posting on our social medial platforms",
      },
      {
        email: "photography",
        purpose:
          "to have professional pictures taken of your foster by our volunteer photographers",
      },
      {
        email: "marketing",
        purpose:
          "for marketing opportunities and needs, including flyers, brochures, etc.",
      },
    ],
  },
  {
    teamName: "Development & Events Teams",
    primaryContact: "Jackie Spett (jackie@angelsrescue.org)",
    contacts: [
      {
        email: "events",
        purpose:
          "for questions about Angels events or to direct people asking about having an event",
      },
      {
        email: "matchinggifts",
        purpose: "if your company does matching gifts",
      },
      {
        email: "donate",
        purpose:
          "donations questions, problems, or to request a thank you card",
      },
    ],
  },
];

interface TeamProps {
  team: Team;
  children: JSX.Element | JSX.Element[];
}

interface TeamContactProps {
  contact: string;
  purpose: string;
}

function TeamContact({ contact, purpose }: TeamContactProps) {
  return (
    <Flex
      bgColor="tag-primary-bg"
      flexDir="column"
      paddingX={4}
      paddingY={3}
      borderRadius={10}
    >
      <Text fontWeight="600">{`${contact}@angelsrescue.org`}</Text>
      <Text>{purpose}</Text>
    </Flex>
  );
}

function Team({ team, children }: TeamProps) {
  return (
    <Flex
      w="100%"
      display="inline-block"
      direction="column"
      bgColor="#FFFFFF"
      border="solid"
      borderRadius={12}
      borderWidth="2px"
      borderColor="#BBBBBB"
      paddingX={6}
      paddingY={4}
      margin={{ sm: "12px", lg: "10px" }}
      marginTop={{ sm: "6px", lg: "5px" }}
    >
      <Text fontSize="lg" fontWeight="600">
        {team.teamName}
      </Text>
      {team.primaryContact && (
        <Text fontSize="md" fontWeight="600" marginBottom={3}>
          {team.primaryContact}
        </Text>
      )}
      <Stack direction="column" gap={3}>
        {children}
      </Stack>
    </Flex>
  );
}

function Resources() {
  return (
    <Flex
      display={["none", "flex"]}
      bgColor="bg-primary"
      justifyContent="center"
    >
      <Box
        width="80%"
        p={8}
        bgColor="white"
        borderRadius={12}
        mt={100}
        mb={100}
      >
        <Box w="100%" textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="600"
            lineHeight="24px"
            letterSpacing="wide"
          >
            Resources
          </Text>
        </Box>
        <Flex
          direction="column"
          bgColor="#FFFFFF"
          border="solid"
          borderRadius={12}
          borderWidth="2px"
          borderColor="#BBBBBB"
          paddingX={6}
          paddingTop={4}
          margin={{ sm: "12px", lg: "10px" }}
          marginTop={{ sm: "6px", lg: "20px" }}
        >
          <Box w="100%" textAlign="center" marginBottom={4}>
            <Text
              fontSize="xl"
              fontWeight="400"
              lineHeight="20px"
              letterSpacing="wide"
            >
              Important Phone Numbers To Save In Your Phone
            </Text>
          </Box>
          <Divider />
          <Flex direction="row" marginY={6} alignItems="stretch" gap={6}>
            <Flex
              bgColor="btn-solid-primary-bg"
              textColor="white"
              alignItems="center"
              textAlign="center"
              justifyContent="space-between"
              flexDir="column"
              borderRadius={12}
              padding="18px"
              flex="1"
            >
              <Text fontSize="lg" fontWeight="600">
                Emergency Vet Line
              </Text>
              <Text fontSize="md">(Dog medical emergencies)</Text>
              <Text fontSize="xl" fontWeight="600">
                <PhoneIcon marginRight="4px" />
                470-239-5502
              </Text>
            </Flex>
            <Flex
              bgColor="btn-solid-primary-bg"
              textColor="white"
              alignItems="center"
              textAlign="center"
              justifyContent="space-between"
              flexDir="column"
              borderRadius={12}
              padding="18px"
              flex="1"
            >
              <Text fontSize="lg" fontWeight="600">
                Lost Dog Hotline
              </Text>
              <Text fontSize="md">(Lost AAU Dogs - call right away!)</Text>
              <Text fontSize="xl" fontWeight="600">
                <PhoneIcon marginRight="4px" />
                678-792-8774
              </Text>
            </Flex>
            <Flex
              bgColor="btn-solid-primary-bg"
              textColor="white"
              alignItems="center"
              textAlign="center"
              justifyContent="space-between"
              flexDir="column"
              borderRadius={12}
              padding="18px"
              flex="1"
            >
              <Text fontSize="lg" fontWeight="600">
                Foster Hotline
              </Text>
              <Text fontSize="md">(Any foster questions or problems)</Text>
              <Text fontSize="xl" fontWeight="600">
                <PhoneIcon marginRight="4px" />
                470-705-7870
              </Text>
            </Flex>
            <Flex
              bgColor="btn-solid-primary-bg"
              textColor="white"
              alignItems="center"
              textAlign="center"
              justifyContent="space-between"
              flexDir="column"
              borderRadius={12}
              padding="18px"
              flex="1"
            >
              <Text fontSize="lg" fontWeight="600">
                Kim Kay
              </Text>
              <Text fontSize="md">
                (Executive Director, issues or assistance)
              </Text>
              <Text fontSize="xl" fontWeight="600">
                <PhoneIcon marginRight="4px" />
                404-573-8800
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box sx={{ columnCount: [1, 2] }} w="100%" mx="auto">
          {TEAMS.map((team) => {
            return (
              <Team team={team} key={team.teamName}>
                {team.contacts.map((contact) => {
                  return (
                    <TeamContact
                      key={contact.purpose}
                      contact={contact.email}
                      purpose={contact.purpose}
                    />
                  );
                })}
              </Team>
            );
          })}
        </Box>
      </Box>
    </Flex>
  );
}

export default pageAccessHOC(Resources);
