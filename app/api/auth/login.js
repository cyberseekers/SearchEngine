import { prisma } from '../../../lib/database/index'
import crypto from 'node:crypto';



export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: { username },
            });

            if (user && user.passwordHash === password) {
                const token = crypto.randomBytes(16).toString('hex');
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}