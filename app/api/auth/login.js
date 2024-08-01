import { prisma } from "../../../lib/database/index";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: { Admin: true },
      });

      if (user && user.passwordHash === password) {
        res
          .status(200)
          .json({ username: user.username, isAdmin: !!user.Admin });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
