import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SignIn Page Moodle | Peer Assesment"
        description="Ini adalah Halaman Masuk Moodle Peer Assesment"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
