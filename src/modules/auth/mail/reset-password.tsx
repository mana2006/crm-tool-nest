import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Text,
} from '@react-email/components';

interface ResetPasswordProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordTemplate(data: ResetPasswordProps) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: '#f4f4f5',
          fontFamily: 'Arial, sans-serif',
          padding: '24px 0',
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '480px',
          }}
        >
          <Heading>Reset your password</Heading>

          <Text>Hello {data.name},</Text>

          <Text>
            We received a request to reset your password. Click the button below
            to continue.
          </Text>

          <Button
            href={data.resetUrl}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            Reset password
          </Button>

          <Hr />

          <Text>
            This link expires in 15 minutes. If you did not request this, you
            can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
