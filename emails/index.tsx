import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  userName: string;
  verificationCode: string;
}

export default function VerificationEmail({
  userName,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Thank your for registering to our app.</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {userName},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering for our app. Please use the following
            verification code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>{verificationCode}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
