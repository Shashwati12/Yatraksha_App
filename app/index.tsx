import { Redirect } from 'expo-router';

export default function Index() {
  // For now, redirect to auth. In production, you would check authentication state
  return <Redirect href="/welcome" />;
}