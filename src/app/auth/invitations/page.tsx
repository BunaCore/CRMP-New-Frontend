import type { FC } from "react";

import type { Metadata } from "next";

import InvitationAcceptClientPage from "./_components/InvitationAcceptClientPage";

export const metadata: Metadata = {
  title: "Accept Invitation | CRMP",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const InvitationPage: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;

  const token = typeof params?.token === "string" ? params.token : "";

  return <InvitationAcceptClientPage token={token} />;
};

export default InvitationPage;
