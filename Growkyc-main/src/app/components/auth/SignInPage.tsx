import React from 'react';
import SignIn from '../../../imports/SignIn';

interface SignInPageProps {
  onSuccess?: () => void;
}

export function SignInPage({ onSuccess }: SignInPageProps = {}) {
  return <SignIn onSuccess={onSuccess} />;
}
