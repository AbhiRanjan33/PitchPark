import InvestorForm from "@/components/InvestorForm";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

const Page = async () => {
  const session = await auth();

  // Fetch user, allow null
  const user = session?.id
    ? await client.fetch(
        `*[_type == "user" && _id == $id][0]`,
        { id: session.id }
      )
    : null;

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Create Your Investor Profile</h1>
      </section>

      <InvestorForm user={user} />
    </>
  );
};

export default Page;