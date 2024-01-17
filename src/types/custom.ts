export interface EmailSenderDataProps {
  to: string;
  from?: string;
  subject: string;
  text: string;
  htm: string;
}

// Authentication Types

// Sign up
export interface SignupParameters {
  username: string
  name: string;
  email: string
  password: string
  phone_number: string
  role?: string
}