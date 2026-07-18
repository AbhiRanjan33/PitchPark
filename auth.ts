import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

// Mock setRoleInStorage for server-side
const setRoleInStorage = (role: string) => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("selectedRole", role);
  }
};

const config: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
          bio: profile.bio || "",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const githubId = profile.id.toString();
      let existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: githubId });

      const defaultRole = "user"; // Change to "investor" based on your logic
      if (!existingUser) {
        existingUser = await writeClient.create({
          _type: "author",
          id: githubId,
          name: user.name,
          username: profile.login,
          email: user.email,
          image: user.image,
          bio: profile.bio || "",
          role: defaultRole,
        });
        setRoleInStorage(defaultRole);
      } else if (!existingUser.role) {
        await writeClient
          .patch(existingUser._id)
          .set({ role: defaultRole })
          .commit();
        setRoleInStorage(defaultRole);
      } else {
        setRoleInStorage(existingUser.role);
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const githubId = profile.id.toString();
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: githubId });
        if (user) {
          token.id = user._id;
          token.role = user.role;
        }
      } else if (token.id) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(`*[_type == "author" && _id == $id][0]{_id, role}`, {
            id: token.id,
          });
        if (user) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.id = token.id;
      if (token.role) session.user.role = token.role;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);